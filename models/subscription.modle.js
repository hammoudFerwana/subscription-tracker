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
    price: {
      type: Number,
      required: [true, "the price is required"],
      validate: {
        validator: function (value) {
          return value > 0;
        },
        message: "the price must be a positive number",
      },
    },
    currency: {
      type: String,
      enum: ["USD", "EUR", "GBP", "JPY", "AUD", "CAD"],
      default: "USD",
    },
    frequency: {
      type: String,
      enum: ["daily", "weekly", "monthly", "yearly"],
    },
    category: {
      type: String,
      required: [true, "the category is required"],
      enum: ["entertainment", "utilities", "software", "other"],
    },
    paymentMethod: {
      type: String,
      trim: true,
      required: [true, "the payment method is required"],
    },
    status: {
      type: String,
      enum: ["active", "canceled", "expired"],
      default: "active",
    },
    startDate: {
      type: Date,
      required: [true, "the start date is required"],
      validate: {
        validator: function (value) {
          return value <= new Date();
        },
        message: "the start date cannot be in the future",
      },
    },
    renewalDate: {
      type: Date,
      validate: {
        validator: function (value) {
          return value > this.startDate;
        },
        message: "the renewal date must be after the start date",
      },
    },
    user: {
      type: moongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "the user is required"],
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

subscriptionSchema.pre("save", function (next) {
  if (!this.renewalDate) {
    const renewalIntervals = {
      daily: 1,
      weekly: 7,
      monthly: 30,
      yearly: 365,
    };
    this.renewalDate = new Date(
      this.startDate.getTime() +
        renewalIntervals[this.frequency] * 24 * 60 * 60 * 1000,
    );
  }

  // if the renewal date is in the past, set the status to expired
  if (this.renewalDate < new Date()) {
    this.status = "expired";
  }
  next();
});

const Subscription = moongoose.model("Subscription", subscriptionSchema);

export default Subscription;
