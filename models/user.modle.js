import mongoose from "mongoose";

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
    },
  },
  { timestamps: true },
);

let User = mongoose.model("User", userSchemas);

export default User;
