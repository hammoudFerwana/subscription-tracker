// all this is for how to send reminders to users before their subscription renewal date using upstash workflow
// so its useful becouse its not good idea to cheak every time if the subscription is going to renew in 7 days or 5 days
// this will made the server to do a lot of work and it will be not efficient
// so we can use upstash workflow to schedule the reminders to be sent at the right time without the need to cheak every time
// so when the user create a subscription we will trigger the workflow to send reminders before the renewal date
// and we will use the sleepUntil function to sleep until the reminder date and then trigger the reminder logic
// and we will use the run function to fetch the subscription data and to trigger the reminder logic so we can have better control
// and we will use the requestPayload to pass the subscriptionId to the workflow so we can fetch the subscription data in the workflow
// ! the context is a link between the express server and the upstach workflow so we can use it to run functions in the workflow and to sleep until a certain date and to access the request payload
// context.run -> is used to run a function in the workflow and it will return the result of that function (so we can use it to fetch the subscription data and to trigger the reminder logic)
import Subscription from "../models/subscription.modle.js";
import appErrs from "../util/appErrs.js";

import dayjs from "dayjs";
import { createRequire } from "module";
import { serve } from "@upstash/workflow/express";

const require = createRequire(import.meta.url);

const reminders = [7, 5, 3, 2, 1];

// 1- when the user create a subscription we will trigger the workflow to send reminders before the renewal date
export const sendReminders = serve(async (context) => {
  // the daa comes to the request payload from the workflow trigger
  // 1- we will fetch the subscription data using the subscriptionId from the request payload
  const { subscriptionId } = context.requestPayload;

  // 2- we will check if the subscription exist and if its active
  const subscription = await fetchSubscription(context, subscriptionId);

  if (!subscription || subscription.status !== "active") {
    return new appErrs("Subscription not found or inactive", 404);
  }

  // 3- feach the value of the renewal date and compare it with the current date if the renewal date
  const renewalDate = dayjs(subscription.renewalDate);

  // 4- cheak if the renewal date has passed if it has passed we will stop the workflow and we will not send any reminders
  if (renewalDate.isBefore(dayjs())) {
    console.log(
      `Renewal date has passed for subscription: ${subscriptionId} stoping workflow`,
    );
    return new appErrs("Renewal date has passed, stopping workflow", 400);
  }
  // 5- if the renewal date has not passed we will schedule the reminders to be sent at the right time using the sleepUntil function
  for (const daysBeforeRenewal of reminders) {
    const reminderDate = renewalDate.subtract(daysBeforeRenewal, "day");

    // 6- if the reminder date is after the current date we will sleep until the reminder date and then trigger the reminder logic
    if (reminderDate.isAfter(dayjs())) {
      await sleepUntilReminder(
        context,
        `reminder-${daysBeforeRenewal}-days before`,
        reminderDate,
      );
    }
    // 7- if the reminder date is before the current date we will trigger the reminder logic immediately
    await triggerReminder(context, `reminder-${daysBeforeRenewal}-days before`);
  }
});

const fetchSubscription = async (context, subscriptionId) => {
  // i can change the name (get subscription) to any name i want its just for logging purposes in the upstash dashboard
  return await context.run("get subscription", async () => {
    return await Subscription.findById(subscriptionId).populate(
      "user",
      "name email",
    );
  });
};

const sleepUntilReminder = async (context, lable, date) => {
  console.log(`Sleeping until ${lable} reminder at ${date}`);
  // date.toDate() is to convert the dayjs object to a javascript date object because the sleepUntil function accept only javascript date object
  await context.sleepUntil(lable, date.toDate());
};

const triggerReminder = async (context, lable) => {
  return await context.run(lable, () => {
    console.log(
      `Triggering ${lable} reminder for subscription: ${context.requestPayload.subscriptionId}`,
    );
    // send email logic here || SMS logic here
  });
};
