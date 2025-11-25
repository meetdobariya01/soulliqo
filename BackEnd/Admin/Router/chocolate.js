const express = require("express");
const router = express.Router();
const Chocolate = require("../Models/Chocolate");
const { authenticateAdmin } = require("../Middleware/authAdmin");

router.get("/", authenticateAdmin, async (req, res) => {
  const chocolates = await Chocolate.find();
  res.json(chocolates);
});

router.post("/", authenticateAdmin, async (req, res) => {
  const choc = new Chocolate(req.body);
  await choc.save();
  res.json({ message: "Chocolate added", chocolate: choc });
});

router.put("/:id", authenticateAdmin, async (req, res) => {
  const choc = await Chocolate.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json({ message: "Chocolate updated", chocolate: choc });
});

router.delete("/:id", authenticateAdmin, async (req, res) => {
  await Chocolate.findByIdAndDelete(req.params.id);
  res.json({ message: "Chocolate deleted" });
});

module.exports = router;
