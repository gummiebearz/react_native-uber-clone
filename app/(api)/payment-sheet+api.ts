import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: 1000,
            currency: "usd",
            automatic_payment_methods: {
                enabled: true
            }
        })

        return Response.json({
            paymentIntent: paymentIntent.client_secret
        });
    } catch (error) {
        console.log(error)

        return Response.json({
            error: "Failed to create payment intent"
        }, {status: 500})
    }
}
