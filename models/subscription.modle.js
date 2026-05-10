import moongoose from "mongoose";

const subscriptionSchema = new moongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "the name is required"],
      minlength: 2,
      maxlength: 50,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);
