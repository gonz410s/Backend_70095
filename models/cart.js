const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product' // Asegúrate de que este nombre coincida con el modelo de productos
        },
        quantity: { type: Number, default: 1 }
    }],
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;