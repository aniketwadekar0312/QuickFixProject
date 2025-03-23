import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";

// Load Stripe (Replace with your actual public key)
const stripePromise = loadStripe("pk_test_51MX036SABObgi1uhHXCwZMh1JkOuNafgiCZWnvEEzRHTPNDRFbwlOr5TOopcgNnuMQ0gDTnqWKWlZhzlrHZUTKH800JIj4QVSP");

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App stripePromise={stripePromise} />
    </BrowserRouter>
  </StrictMode>
);
