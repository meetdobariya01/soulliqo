const express = require("express");
const router = express.Router();
const Wishlist = require("../Models/Wishlist"); // create Wishlist model with userId & products
const mongoose = require("mongoose");

// Dummy middleware to check for authentication token (Bearer token logic)
// In a real application, this would decode the token and set req.user.id
const authenticateToken = (req, res, next) => {
    // Check for Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    // Assuming the user is logged in if a token is present, 
    // but in a real app, you would verify the token with jwt.verify()
    if (!token) {
        // If the user is trying to access a protected route without a token
        // In the wishlist check, we allow to proceed, but for adding/removing, it should fail
        // For the GET, we will let it proceed for now, but log a warning.
        console.warn("Authentication token missing in wishlist route.");
    }
    // Proceed for now. In a real app, uncomment: // if (!token) return res.sendStatus(401);

    // This is just a placeholder for full authentication setup
    next();
};

// Get wishlist by user ID
router.get("/:userId", authenticateToken, async (req, res) => {
    try {
        const { userId } = req.params;
        // The front-end now uses a placeholder 'DEMO_USER_ID_123' if not logged in.
        // We must check if the ID is a valid MongoDB ObjectId.
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            // ✅ FIX: Send a 400 with a clear message for invalid ID formats
            // This will help the frontend handle the error gracefully, instead of a generic failure.
            // If the frontend placeholder is used, it should be handled there.
            if (userId.startsWith("DEMO")) return res.json([]); // Return empty array for demo ID
            return res.status(400).json({ message: "Invalid user ID format" });
        }

        // The current logic returns `[]` if no wishlist document is found, which is correct
        const wishlist = await Wishlist.findOne({ user: userId }).populate("products");
        // Returning `wishlist?.products || []` ensures the response is ALWAYS an array,
        // which fixes the `data.some is not a function` error in the frontend.
        res.json(wishlist?.products || []); 
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add product to wishlist
router.post("/:userId/add/:productId", authenticateToken, async (req, res) => {
    try {
        const { userId, productId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(productId))
            return res.status(400).json({ message: "Invalid ID format for user or product." });

        let wishlist = await Wishlist.findOne({ user: userId });
        if (!wishlist) wishlist = await Wishlist.create({ user: userId, products: [] });

        if (!wishlist.products.map(p => p.toString()).includes(productId)) {
            wishlist.products.push(productId);
            await wishlist.save();
        }
        res.json({ message: "Added to wishlist" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Remove product from wishlist
router.delete("/:userId/remove/:productId", authenticateToken, async (req, res) => {
    try {
        const { userId, productId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(productId))
            return res.status(400).json({ message: "Invalid ID format for user or product." });

        const wishlist = await Wishlist.findOne({ user: userId });
        if (!wishlist) return res.status(404).json({ message: "Wishlist not found for this user." });

        const initialLength = wishlist.products.length;
        wishlist.products = wishlist.products.filter(p => p.toString() !== productId);
        
        if (wishlist.products.length < initialLength) {
            await wishlist.save();
            res.json({ message: "Removed from wishlist" });
        } else {
            // Added explicit message if product was not found in the list
            res.status(404).json({ message: "Product not found in wishlist." });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;