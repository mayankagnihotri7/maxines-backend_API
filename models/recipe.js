let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let recipeSchema = new Schema(
  {
    ingredients: [String],
    process: String,
    servings: String,
    image: String,
    category: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Recipe", recipeSchema);
