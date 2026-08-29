import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {name, email, amount} = body;
        if (!name || !email || !amount) return Response.json({
            error: "Missing required fields"
        }, {status: 400})

        // Find existing customer in Stripe
        // If not found, create a new customer
        let customer
        const existingCustomer = await stripe.customers.list({email})
        if (existingCustomer.data.length > 0) {
            const newCustomer = await stripe.customers.create({
                name,
                email
            })
            customer = newCustomer
        }

        // Create ephemeral key for customer
        const ephemeralKey = await stripe.ephemeralKeys.create({
            customer: customer?.id
        }, {
            apiVersion: new Date().toLocaleDateString("en-CA") // yyyy-mm-dd
        })

        const paymentIntent = await stripe.paymentIntents.create({
            amount: parseInt(amount) * 100, // Stripe processes payment in cents, so we need to multiply by 100
            currency: "usd",
            customer: customer?.id,
            automatic_payment_methods: {
                enabled: true,
                allow_redirects: "never"
            }
        })

        return Response.json({
            paymentIntent: paymentIntent.client_secret,
            ephemeralKey: ephemeralKey.secret,
            customers: customer?.id
        });
    } catch (error) {
        console.log(error)

        return Response.json({
            error: "Failed to create payment intent"
        }, {status: 500})
    }
}
