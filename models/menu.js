let mongoose = require("mongoose");
let slug = require("slug");
let Schema = mongoose.Schema;

let menuSchema = new Schema(
  {
    dishName: {
      type: String,
      required: true,
    },
    cost: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    image: String,
    category: [String],
    favorited: [String],
    favoriteCount: Number,
    author: { type: Schema.Types.ObjectId, ref: "User" },
    slug: String,
  },
  { timestamps: true }
);

menuSchema.pre("save", function (next) {
  if (this.dishName && this.isModified("dishName")) {
    let slugged = slug(this.dishName, { lower: true });
    this.slug = slugged;
    next();
  }
  next();
});

module.exports = mongoose.model("Menu", menuSchema);
