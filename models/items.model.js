const { Schema, model } = require("mongoose");

const ItemSchema = new Schema(
  {
    modelName: {
      type: String,
      required: true,
    },
    price: { type: Number, required: true },

    quantity: { type: Number, required: true },
  },

  { timestamps: true, required: true }
);

module.exports = model("item", ItemSchema);
