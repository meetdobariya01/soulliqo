const express = require('express');
const mongoose = require('mongoose');
const asyncHandler = require('../Middleware/asyncHandler');
const { authenticate } = require('../Middleware/authenticate');
const Collections = require('../Models/Category');
const Box = require('../Models/Box');
const Chocolate = require('../Models/Chocolate');
const Cart = require('../Models/Cart');

const router = express.Router();

router.get('/categories', asyncHandler(async (req, res) => {
  const categories = await Collections.find().select('COLLECTION description').lean();
  const formatted = categories.map(cat => ({
    _id: cat._id,
    name: (cat.COLLECTION || "").trim(),
    description: cat.description || "",
  }));
  res.json(formatted);
}));

/* ----------------- Step 2: Get boxes by collection ----------------- */
router.get('/collections/:collectionId/boxes', asyncHandler(async (req, res) => {
  const { collectionId } = req.params;
  const { size } = req.query;

  if (!mongoose.Types.ObjectId.isValid(collectionId)) {
    return res.status(400).json({ message: 'Invalid collection ID' });
  }

  const collection = await Collections.findById(collectionId).select('COLLECTION description');
  if (!collection) return res.status(404).json({ message: 'Collection not found' });

  const collectionName = (collection.COLLECTION || "").trim();

  const boxes = await Box.find({
    COLLECTION: new RegExp(`^\\s*${collectionName}\\s*$`, 'i'),
  }).select('boxName size price COLLECTION BoxCategories totalLimit typeLimits description additionalInformation image');

  if (!boxes.length) return res.status(404).json({ message: 'No boxes found for this collection' });

  // Always return boxes array
  const formattedBoxes = boxes.map(box => ({
    _id: box._id,
    name: box.boxName || "",
    size: box.size,
    price: box.price,
    description: box.description || "",
    image: box.image || './images/product-grid.png',
    additionalInformation: box.additionalInformation || '',
    boxCategories: box.BoxCategories || [],
    totalLimit: box.totalLimit || box.size,
    typeLimits: box.typeLimits || {},
  }));

  // Get unique sizes
  const uniqueSizes = [...new Set(boxes.map(b => b.size))].sort((a, b) => a - b);

  if (!size) {
    return res.json({
      category: { id: collection._id, name: collectionName, description: collection.description || "" },
      availableSizes: uniqueSizes,
      boxes: formattedBoxes
    });
  }

  const filteredBoxes = formattedBoxes.filter(b => b.size === Number(size));
  if (!filteredBoxes.length) return res.status(404).json({ message: `No boxes found for size ${size}` });

  res.json({
    category: { id: collection._id, name: collectionName, description: collection.description || "" },
    size: Number(size),
    boxes: filteredBoxes,
    availableSizes: uniqueSizes
  });
}));


/* ----------------- Step 3: Get chocolates for a box ----------------- */
router.get('/chocolates/:boxId', asyncHandler(async (req, res) => {
  const { categoryId, boxId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(categoryId) || !mongoose.Types.ObjectId.isValid(boxId)) {
    return res.status(400).json({ message: 'Invalid category or box ID' });
  }

  const category = await Collections.findById(categoryId).select('COLLECTION');
  const box = await Box.findById(boxId).select('boxName size price COLLECTION totalLimit typeLimits');

  if (!category || !box) return res.status(404).json({ message: 'Box or category not found' });

  const boxCollection = (box.COLLECTION || "").trim().toLowerCase();
  const categoryName = (category.COLLECTION || "").trim().toLowerCase();

  if (boxCollection !== categoryName) {
    return res.status(400).json({ message: 'Box does not belong to this category' });
  }

  const chocolates = await Chocolate.find({
    COLLECTION: boxCollection,
  }).select('chocolateName chocolateType COLLECTION _id SKU_CODE price BoxCategories description image');

  if (!chocolates.length) return res.status(404).json({ message: 'No chocolates found for this collection' });

  const formatted = chocolates.map(choc => ({
    _id: choc._id,
    name: choc.chocolateName || "",
    type: choc.chocolateType || "",
    sku: choc.SKU_CODE || "",
    description: choc.description || "",
    price: choc.price,
    boxCategories: choc.BoxCategories || [],
    image: choc.image || './images/product-grid.png',
    box: {
      _id: box._id,
      name: box.boxName || "",
      size: box.size,
      price: box.price,
      totalLimit: box.totalLimit || box.size,
      typeLimits: box.typeLimits || {},
    },
    category: { _id: category._id, name: categoryName },
  }));

  res.json(formatted);
}));
/* ----------------- Step 4: Add custom box to cart ----------------- */
router.post('/cart/add', authenticate, asyncHandler(async (req, res) => {
  const { boxId, chocolates } = req.body;

  if (!mongoose.Types.ObjectId.isValid(boxId)) {
    return res.status(400).json({ message: 'Invalid box ID' });
  }
  if (!Array.isArray(chocolates) || !chocolates.every(c => mongoose.Types.ObjectId.isValid(c.chocolateId) && c.quantity >= 0)) {
    return res.status(400).json({ message: 'Invalid chocolates array or quantities' });
  }

  const box = await Box.findById(boxId)
    .select('size totalLimit typeLimits COLLECTION price boxName chocolates')
    .populate({
      path: 'chocolates.chocolate',
      select: 'chocolateName chocolateType price COLLECTION',
    });
  if (!box) return res.status(404).json({ message: 'Box not found' });

  const chocolateDetails = box.chocolates
    .filter(c => chocolates.some(ch => ch.chocolateId === c.chocolate._id.toString()))
    .map(c => ({ ...c.chocolate.toObject(), maxQuantity: c.maxQuantity }));

  // Detailed validation for chocolates
  const invalidIds = chocolates
    .filter(c => !box.chocolates.some(ch => ch.chocolate._id.toString() === c.chocolateId))
    .map(c => c.chocolateId);
  if (invalidIds.length) {
    return res.status(400).json({ message: `Invalid chocolate IDs: ${invalidIds.join(', ')}` });
  }

  const invalidCollections = chocolateDetails.filter(
    c => c.COLLECTION.trim().toLowerCase() !== box.COLLECTION.trim().toLowerCase()
  );
  if (invalidCollections.length) {
    const names = invalidCollections.map(c => c.chocolateName);
    return res.status(400).json({ message: `Chocolates not in box's collection: ${names.join(', ')}` });
  }

  // Validate maxQuantity per chocolate
  for (const selected of chocolates) {
    const boxChocolate = box.chocolates.find(
      c => c.chocolate._id.toString() === selected.chocolateId
    );
    if (!boxChocolate) {
      return res.status(400).json({
        message: `Chocolate ${selected.chocolateId} not allowed in this box`,
      });
    }
    if (selected.quantity > boxChocolate.maxQuantity) {
      return res.status(400).json({
        message: `Max quantity for ${boxChocolate.chocolate.chocolateName} is ${boxChocolate.maxQuantity}`,
      });
    }
  }

  const totalChocolates = chocolates.reduce((sum, c) => sum + (c.quantity || 0), 0);
  const totalLimit = box.totalLimit || box.size;
  if (totalChocolates > totalLimit) {
    return res.status(400).json({ message: `Total chocolates (${totalChocolates}) exceeds box limit (${totalLimit})` });
  }

  const typeCounts = {};
  chocolates.forEach(c => {
    const choc = chocolateDetails.find(ch => ch._id.toString() === c.chocolateId);
    if (choc) {
      typeCounts[choc.chocolateType] = (typeCounts[choc.chocolateType] || 0) + (c.quantity || 0);
    }
  });

  for (const [type, count] of Object.entries(typeCounts)) {
    const limit = box.typeLimits[type] || totalLimit;
    if (count > limit) {
      return res.status(400).json({ message: `Too many ${type} chocolates. Limit is ${limit}, selected ${count}` });
    }
  }

  const totalPrice = chocolateDetails.reduce((sum, choc) => {
    const quantity = chocolates.find(c => c.chocolateId === choc._id.toString()).quantity || 0;
    return sum + (choc.price * quantity);
  }, box.price);

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    cart = new Cart({ user: req.user._id, items: [], total: 0 });
  }

  const customBox = {
    boxId: box._id,
    boxName: box.boxName,
    boxPrice: box.price,
    chocolates: chocolates.map(c => ({
      chocolateId: c.chocolateId,
      quantity: c.quantity,
      name: chocolateDetails.find(ch => ch._id.toString() === c.chocolateId).chocolateName,
      price: chocolateDetails.find(ch => ch._id.toString() === c.chocolateId).price,
    })),
    totalPrice,
  };

  cart.items.push(customBox);
  cart.total += totalPrice;
  await cart.save();

  res.status(201).json({
    message: 'Custom box added to cart',
    cart: {
      _id: cart._id,
      items: cart.items,
      total: cart.total,
    },
  });
}));

/* ----------------- Step 5: Get single box + chocolates ----------------- */
// Get single box + chocolates filtered by category
// ✅ Step 5: Get single box + chocolates filtered by category
router.get('/boxes/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { category } = req.query; // box category name like CLASSIC, SIGNATURE

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid box ID' });
  }

  const box = await Box.findById(id).lean();
  if (!box) return res.status(404).json({ message: 'Box not found' });

  // 🧠 base query — chocolates from same collection
  const query = {
    COLLECTION: box.COLLECTION, // match same collection
  };

  // 🧠 optional: filter by selected box category
  if (category) {
    query.BoxCategories = { $regex: new RegExp(`^${category}$`, 'i') };
  }

  const chocolates = await Chocolate.find(query).lean();
 
  const mappedChocolates = chocolates.map(choc => ({
    _id: choc._id,
    name: choc.chocolateName,
    sku: choc.SKU_CODE,
    price: choc.price,
    type: choc.chocolateType,
    description: choc.description,
    image: choc.image || './images/product-grid.png',
    boxCategories: choc.BoxCategories || [],
  }));

  res.json({
    box: {
      _id: box._id,
      name: box.boxName,
      size: box.size,
      price: box.price,
      totalLimit: box.totalLimit || box.size,
      typeLimits: box.typeLimits || {},
      categoryId: box.COLLECTION,
      description: box.description || '',
      image: box.image || './images/product-grid.png',
      availableCategories: box.BoxCategories || [],
    },
    products: mappedChocolates,
  });
}));


/* ----------------- Step 6: Get user cart ----------------- */
router.get('/cart', authenticate, asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).lean();
  if (!cart) return res.status(404).json({ message: 'Cart not found' });
  res.json({ cart });
}));

module.exports = router;



// PORT=8000
// # MONGO_URI=mongodb://127.0.0.1:27017/soliquo

// # JWT_SECRET=2b99f3132d213a400ab55196717650da0c2c8e24b36841d4825126bae0b102ca36e327673bf7a0442be5d9385258746f0a1bec6a125fced1eebda18c7c34838a
// # MAIL_USER=prajapativashishtha33@gmail.com
// # MAIL_PASS=xwdvvutdzimznftd
// # EMAIL_USER=prajapativashishtha33@gmail.com
// # EMAIL_PASS=xwdvvutdzimznftd

// # SESSION_SECRET=037a313eb5104451a697053a31cde5da64c48097a9a21d56a46243324e7c43356144618ad822ec1e935f285eca6cb28715450526aea07b8335db49e8cc52ab3e
// # FRONTEND_URL=http://localhost:3000
// # CLIENT_URL=http://localhost:3000
// # # Google


// # ADMIN_EMAIL=vashishthaprajapati33.starlight@gmail.com
// # SERVER_URL=http://localhost:8000
