import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder");

export const createCheckoutSession = async ({ amount, currency = "usd", bookingId, customerEmail }) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency,
          product_data: {
            name: "Wayfarer Tour Booking",
          },
          unit_amount: Math.round(amount * 100),
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    customer_email: customerEmail,
    success_url: `${process.env.CLIENT_URL || "http://localhost:5173"}/booking/success?session_id={CHECKOUT_SESSION_ID}&bookingId=${bookingId}`,
    cancel_url: `${process.env.CLIENT_URL || "http://localhost:5173"}/booking/cancel?bookingId=${bookingId}`,
    metadata: {
      bookingId,
    },
  });

  return session;
};
