const mongoose = require("mongoose");
const Classification = require("../Models/Classification");
const Box = require("../Models/Box");
const Chocolate = require("../Models/Chocolate");

exports.getClassifications = async (req, res) => {
  try {
    const classifications = await Classification.find();
    res.json(classifications);
  } catch (err) {
    console.error("Error fetching classifications:", err);
    res.status(500).json({ message: "Error fetching classifications" });
  }
};

exports.getBoxSizes = async (req, res) => {
  try {
    const { classificationId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(classificationId))
      return res.status(400).json({ message: "Invalid classification ID" });

    const classification = await Classification.findById(classificationId);
    if (!classification)
      return res.status(404).json({ message: "Classification not found" });

    const sizes = await Box.distinct("size", { classification: classificationId });
    res.json(sizes);
  } catch (err) {
    console.error("Error fetching box sizes:", err);
    res.status(500).json({ message: "Error fetching box sizes" });
  }
};

exports.getBoxes = async (req, res) => {
  try {
    const { classificationId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(classificationId))
      return res.status(400).json({ message: "Invalid classification ID" });

    const classification = await Classification.findById(classificationId);
    if (!classification)
      return res.status(404).json({ message: "Classification not found" });

    const boxes = await Box.find({ classification: classificationId }).select("size price category name limited image");
    res.json(boxes);
  } catch (err) {
    console.error("Error fetching boxes:", err);
    res.status(500).json({ message: "Error fetching boxes" });
  }
};

exports.getBoxCategories = async (req, res) => {
  try {
    const { classificationId, size } = req.params;

    if (!mongoose.Types.ObjectId.isValid(classificationId))
      return res.status(400).json({ message: "Invalid classification ID" });

    const classification = await Classification.findById(classificationId);
    if (!classification)
      return res.status(404).json({ message: "Classification not found" });

    const categories = await Box.distinct("category", {
      classification: classificationId,
      size: Number(size),
    });

    res.json(categories);
  } catch (err) {
    console.error("Error fetching categories:", err);
    res.status(500).json({ message: "Error fetching categories" });
  }
};

exports.getChocolates = async (req, res) => {
  try {
    const { classificationId, size, category } = req.params;

    if (!mongoose.Types.ObjectId.isValid(classificationId))
      return res.status(400).json({ message: "Invalid classification ID" });

    const box = await Box.findOne({
      classification: classificationId,
      size: Number(size),
      category,
    }).populate("chocolates.chocolate");

    if (!box) return res.status(404).json({ message: "Box not found" });

    res.json({
      box,
      chocolates: box.chocolates.map((c) => ({
        _id: c.chocolate._id,
        name: c.chocolate.name,
        price: c.chocolate.price,
        type: c.chocolate.type,
        description: c.chocolate.description,
        image: c.chocolate.image || "/images/category-placeholder.png",
        maxQuantity: c.maxQuantity,
      })),
    });
  } catch (err) {
    console.error("Error fetching chocolates:", err);
    res.status(500).json({ message: "Error fetching chocolates" });
  }
};

exports.checkout = async (req, res) => {
  try {
    const { boxId, selectedChocolates } = req.body;
    const box = await Box.findById(boxId).populate("chocolates.chocolate");
    if (!box) return res.status(404).json({ message: "Box not found" });

    let totalSelected = 0;

    for (let selected of selectedChocolates) {
      const boxChocolate = box.chocolates.find(
        (c) => c.chocolate._id.toString() === selected.chocolateId
      );

      if (!boxChocolate) {
        return res.status(400).json({
          message: `Chocolate ${selected.chocolateId} not allowed in this box`,
        });
      }

      if (selected.quantity > boxChocolate.maxQuantity) {
        return res.status(400).json({
          message: `Max quantity for ${boxChocolate.chocolate.name} is ${boxChocolate.maxQuantity}`,
        });
      }

      totalSelected += selected.quantity;
    }

    if (totalSelected > box.size) {
      return res.status(400).json({ message: "Total chocolates exceed box size" });
    }

    res.json({
      message: "Checkout successful",
      box,
      selectedChocolates,
      totalPrice: box.price,
    });
  } catch (err) {
    console.error("Checkout error:", err);
    res.status(500).json({ message: "Checkout error" });
  }
};