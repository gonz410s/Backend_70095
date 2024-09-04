const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    userId: { type: String, ref: 'User' }, 
    products: [{
        product: { type: String, ref: 'Product' }, 
        quantity: { type: Number, required: true }
    }]
}, { timestamps: true });

module.exports = mongoose.model('Cart', cartSchema);
