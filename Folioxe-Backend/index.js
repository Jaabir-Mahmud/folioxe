import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Stripe from 'stripe';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static download files
app.use('/downloads', express.static('../public/downloads'));

// ✅ Stripe setup using env variable
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
  console.error('❌ Stripe secret key not found in .env file!');
  process.exit(1); // Stop server if key is missing
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2022-11-15',
});

// ✅ Create Stripe checkout session
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const { items } = req.body;

    const line_items = items.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(Number(item.price) * 100),
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items,
      success_url: 'http://localhost:5173/download', // TODO: update in prod
      cancel_url: 'http://localhost:5173/cart',
    });

    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Health check route
app.get('/', (req, res) => {
  res.send('Folioxe backend is running!');
});

// ✅ Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`✅ Backend running on port ${PORT}`));
