const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customer: {
    type: String,
    required: true
  },
  products: [{
    product: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    price: {
      type: Number,
      required: true
    }
  }],
  total_price: {
    type: Number,
    required: true
  },
  
  status: {
    type: String,
    required: true
  },
  payment_method: {
    type: String,
    required: true
  },

    address_line: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    },
    postal_code: {
      type: String,
      required: true
    },
  phone: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true
  }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
