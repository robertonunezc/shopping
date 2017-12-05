var express = require('express');
var router = express.Router();
var models = require('../models');
let middlewares = require('../middlewares/auth');
/* GET home page. */
router.get('/', function (req, res, next) {
    models.Product
        .all()
        .then(products => {
            res.render('shop/index', {title: 'Express', products: products});
        })
        .catch(err => {
            console.log(err.message)
        });

});

router.get('/add-to-cart/:id', middlewares.isLoggedIn, async function (req, res, next) {
    const productId = req.params.id;
    const userId = req.user.id;
    let productsCart = [];
    let totalPrice = 0;
    let product = await  models.Product.findById(productId);
    let cart = await  models.Cart.findOne({where: req.user.id});
    if (cart === null) {
        cart = await models.Cart.build({
            UserId: userId,
            totalPrice: product.price,
            totalQty: 1
        }).save();
        let productCart = await models.ProductCart.build({
            CartId: cart.id,
            ProductId: productId,
            totalPrice: product.price,
            totalQty: 1
        }).save();
        totalPrice = product.price;
        productsCart.push(productCart)

    }
    productsCart = await models.ProductCart.findAll({where: {CartId: cart.id}});
    for(let product of productsCart){
        console.log(product.getProduct().id);
    }
    return res.render('shop/shopping-cart', {
        totalPrice: totalPrice,
        productsCart: productsCart
    });

});


module.exports = router;
