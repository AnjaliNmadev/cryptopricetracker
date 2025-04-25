const mongoose = require('mongoose');

const coinSchema = new mongoose.Schema({
  id: String,
  name: String,
  symbol: String,
  image: String,
  current_price: Number,
  market_cap: Number,
  price_change_percentage_24h: Number,
});

module.exports = mongoose.model('Coin', coinSchema);
