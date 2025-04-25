const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const cors = require('cors');
const Coin = require('./Coin');
const rateLimit = require("express-rate-limit");



const API_URL = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect("mongodb+srv://anjali05:versa%4005@crypto.kbnkguw.mongodb.net/crypto?retryWrites=true&w=majority", {
  useUnifiedTopology: true
}).then(() => {
  console.log("MongoDB connected");
}).catch((err) => {
  console.error("MongoDB connection error:", err);
});



const fetchAndStoreCoins = async () => {
  try {
    const response = await axios.get(API_URL);
    const coins = response.data;

    // Clear previous records
    await Coin.deleteMany({});

    // Insert new data
    await Coin.insertMany(coins);

    console.log("Coins updated in MongoDB");
  } catch (err) {
    console.error("Error fetching or storing coins:", err);
  }
};

// Fetch data initially and every 10 minute
fetchAndStoreCoins();
setInterval(fetchAndStoreCoins, 600000);

app.get('/api/coins', async (req, res) => {
    try {
      const coins = await Coin.find({});
      res.json(coins);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch coins" });
    }
  });
  
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
  
  const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute window
    max: 30, // limit each IP to 30 requests per minute
  });
  
  app.use(limiter);
  