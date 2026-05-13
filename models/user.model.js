import mongoose from "mongoose";
import bcrypt from "bcryptjs";
let userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "the userName is required"],
      minlength: 2,
      maxlength: 50,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "the email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, // give me a EX: example@example.com
        "Please fill a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "the password is required"],
      minlength: 6,
      select: false,
    },
  },
  { timestamps: true },
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

let User = mongoose.model("User", userSchema);

export default User;
