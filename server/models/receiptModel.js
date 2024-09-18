const mongoose = require('mongoose');
const Product = require('../models/productModel');

const ReceiptSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  products: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
    quantity: {
      type: Number
    },
    total: {
      type: Number
    },
    profit: {
      type: Number
    }
  }],
  paid: {
    type: Boolean,
    default: false
  },
  customer: {
    name: {
      type: String,
    },
    phoneNo: {
      type: String,
    }
  },
  subTotal: {
    type: Number,
    default: 0
  },
   discount: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    default: 0
  },
  totalProfit: { 
    type: Number,
    default: 0
  }
});


const Receipt = mongoose.model('Receipt', ReceiptSchema);

module.exports = Receipt;



