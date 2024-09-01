// controllers/cartController.js
const Cart = require('../models/cart');

exports.getCartById = async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid).populate('products.productId');
    if (cart) {
      res.render('cart', { title: 'Cart Details', cart });
    } else {
      res.status(404).send('Cart not found');
    }
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).send('Server error');
  }
};
