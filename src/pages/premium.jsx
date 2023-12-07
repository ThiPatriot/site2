import React from 'react';
import styles from "../style";
import axios from 'axios'; // HTTP Client
import { Billing, Business, CardDeal, Clients, CTA, Footer, Navbar, Stats, Testimonials, Hero } from "../components";

// Define OAuthButton as a separate functional component
const OAuthButton = () => {
  const initiateOAuth = () => {
    axios.get('https://localhost:3001/start-oauth')
      .then((response) => {
        console.log('OAuth initiated:', response.data);
        // Add logic here to handle the response or subsequent actions
      })
      .catch((error) => {
        console.error('Error initiating OAuth:', error);
        // Add logic here to handle errors if needed
      });
  };

  return (

    <button onClick={initiateOAuth}>Initiate OAuth</button>

  );
};

const PremiumPage = () => (

      <div>
        <OAuthButton />
      </div>

);

export default PremiumPage;
