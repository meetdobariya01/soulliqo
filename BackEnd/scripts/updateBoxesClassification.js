const mongoose = require("mongoose");
const Box = require("../Models/Box");
const Classification = require("../Models/Classification");

mongoose.connect("mongodb://localhost:27017/soulliqo");

async function fixBoxes() {
  try {
    // Fetch all classifications
    const classifications = await Classification.find();
    const nameToId = {};
    classifications.forEach(c => {
      nameToId[c.name.toUpperCase()] = c._id;
    });

    // Fetch all boxes
    const boxes = await Box.find();
    let updatedCount = 0;

    for (const box of boxes) {
      // Skip if classification is already a valid ObjectId
      if (box.classification && mongoose.Types.ObjectId.isValid(box.classification)) {
        console.log(`✅ Skipped box: ${box.name || "Unnamed"} (ID: ${box._id}, already has valid classification)`);
        continue;
      }

      // Check for missing required fields
      if (!box.name) {
        console.log(`❌ Skipping box with ID ${box._id}: Missing name field`);
        continue;
      }

      // Use Classification Name field if present, otherwise infer from name or category
      let className = box["Classification Name"] ? box["Classification Name"].toUpperCase() : null;
      if (!className) {
        const boxNameUpper = box.name.toUpperCase();
        if (boxNameUpper.includes("BON BON / TRUFFLE / PRALINE")) {
          className = "BON BON / TRUFFLE / PRALINE";
        } else if (boxNameUpper.includes("BON BON")) {
          className = "BON BON";
        } else if (boxNameUpper.includes("TRUFFLE")) {
          className = "TRUFFLE";
        } else if (boxNameUpper.includes("PRALINE")) {
          className = "PRALINE";
        } else {
          console.log(`❌ No classification found for box: ${box.name} (ID: ${box._id})`);
          continue;
        }
      }

      if (!nameToId[className]) {
        console.log(`❌ Classification ${className} not found for box: ${box.name} (ID: ${box._id})`);
        continue;
      }

      // Update box
      box.classification = nameToId[className];
      delete box["Classification Name"]; // Remove invalid field
      await box.save();
      console.log(`✅ Updated box: ${box.name} (ID: ${box._id}) → classification: ${className} (ID: ${nameToId[className]})`);
      updatedCount++;
    }

    console.log(`\n🎉 Finished! Total boxes updated: ${updatedCount}`);
  } catch (err) {
    console.error("Error updating boxes:", err);
  } finally {
    mongoose.disconnect();
  }
}

fixBoxes();