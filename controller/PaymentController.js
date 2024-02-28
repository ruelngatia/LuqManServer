import "dotenv/config";
import Stripe from "stripe";
import Payment from "../model/Payment.js";
import { payingUser } from "../store/Paying.js";
import User from "../model/User.js";



// export const getPayment = async (r)

export const createPayment = async (req, res) => {
  const order = req.body;
  console.log(order);
  payingUser.plan = order.plan;
  payingUser.user_id = order.user_id;
  payingUser.site = order.site
  let API_KEY;
  if(order.project === 'headhuntrs') {
    API_KEY = process.env.HEADHUNTRS_PAYMENT_API    
    // API_KEY = process.env.STRIPE_PRIVATE_KEY   
  }else if(order.project === 'mindmysteries') {
    // API_KEY = process.env.MINDMYSTERIES_PAYMENT_API
    API_KEY = process.env.STRIPE_PRIVATE_KEY   
  }else if(order.project === 'mysupervisr') {
    // API_KEY = process.env.MYSUPERVISR_PAYMENT_API
    API_KEY = process.env.STRIPE_PRIVATE_KEY   
  }
  else if(order.project === 'cleanwaste') {
    // API_KEY = process.env.CLEANWASTE_PAYMENT_API
    API_KEY = process.env.STRIPE_PRIVATE_KEY   
  }
  
  const stripe = new Stripe(API_KEY);
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "gbp",
            product_data: {
              name: order.plan,
            },
            unit_amount: Math.max(parseInt(order.amount * 100), 50),
          },
          quantity: 1,
        },
      ],
      success_url: `https://luqman-auth-andpayment-server.onrender.com/success`,
      cancel_url: `https://luqman-auth-andpayment-server.onrender.com/cancel`,
    });
    res.json({ url: session.url }).status(200);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const success = async (req, res) => {
  try {
    const data = {
      user_id: payingUser.user_id,
      amount: req.query.amount_total,
      plan: payingUser.plan,
    };
    const user = await User.findOne({ _id: data.user_id });
    if (!user) {
      res.json({ message: "User not found" });
    }

    //update the user details in the db
    user.plan = data.plan;
    await user.save();

    //insert the payment info in the
    const payment = await Payment.create(data);

    //redirecting the user to the dashboard
    setTimeout(() => {
      res.redirect(303, `${payingUser.site}`);
    }, 3000);
  } catch (error) {
    console.error(error);
    res.json({ error: error }).status(500);
  }
};

export const cancel = async (req, res) => {
  //redirect to the dashboard
  res.redirect(303, `${payingUser.site}`);
};
