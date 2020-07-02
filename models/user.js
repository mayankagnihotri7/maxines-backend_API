let mongoose = require("mongoose");
let bcrypt = require("bcrypt");
let Schema = mongoose.Schema;

let userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      trim: true,
      required: true,
    },
    bio: String,
    image: String,
  },
  { timestamps: true }
);

// Hashing the password.
userSchema.pre("save", async function (next) {
  try {
    if (this.password && this.isModified("password")) {
      this.password = await bcrypt.hash(this.password, 10);
      return next();
    }
  } catch (error) {
    return next(error);
  }
});

// verify password.
userSchema.methods.verifyPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Create user model
module.exports = mongoose.model("User", userSchema);
