const express = require("express");
const router = express.Router();
const Box = require("../Models/Box");
const { authenticateAdmin } = require("../Middleware/authAdmin");

router.get("/", authenticateAdmin, async (req, res) => {
  const boxes = await Box.find();
  res.json(boxes);
});

router.post("/", authenticateAdmin, async (req, res) => {
  const box = new Box(req.body);
  await box.save();
  res.json({ message: "Box created", box });
});

router.put("/:id", authenticateAdmin, async (req, res) => {
  const box = await Box.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json({ message: "Box updated", box });
});

router.delete("/:id", authenticateAdmin, async (req, res) => {
  await Box.findByIdAndDelete(req.params.id);
  res.json({ message: "Box deleted" });
});

module.exports = router;
