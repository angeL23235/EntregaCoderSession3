const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema(
  {
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Products' },
        qty: { type: Number, default: 1, min: 1 }
      }
    ]
  },
  { timestamps: true, collection: 'carts' }
);

module.exports = mongoose.model('Carts', CartSchema);
