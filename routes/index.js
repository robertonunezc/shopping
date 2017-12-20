let express = require('express');
let router = express.Router();
let models = require('../models');
let middlewares = require('../middlewares/auth');
/* GET home page. */
router.get('/', function (req, res) {
    models.Product
        .all()
        .then(products => {
            res.render('shop/index', {title: 'Express', products: products});
        })
        .catch(err => {
            console.log(err.message)
        });

});

router.get('/shopping-cart/', middlewares.isLoggedIn, function (req, res) {
    models.ProductCart.findAll({
        where: {
            cartId: cart.id,
        },
        include: [{
            model: models.Product,
            as: 'product'
        }]
    })
        .then(productCart => {
            productsCart = productCart;
            return res.render('shop/shopping-cart',
                {
                    totalPrice: totalPrice,
                    productsCart: productsCart
                })
        })
        .catch(err => {
            console.log('ERROR:', err);
            return res.redirect('/');
        });
});

router.get('/add-to-cart/:id', middlewares.isLoggedIn, async function (req, res) {
    const productId = req.params.id;
    const userId = req.user.id;
    let productsCart = [];
    let totalPrice = 0;
    try {
        // buscamos si el producto existe
        let product = await models.Product.findById(productId);
        let cart = await models.Cart.findOne({
            where: {
                UserId: req.user.id
            }
        });
        if (cart === null) {
            let newCart = await models.Cart
                .build({
                    UserId: userId,
                    totalPrice: product.price,
                    totalQty: 1
                })
                .save();

            let productCart = await models.ProductCart.build({
                cartId: newCart.id,
                productId: productId,
                totalPrice: product.price,
                totalQty: 1
            })
                .save();
            await productsCart.push(productCart)
        }

        if (cart !== null) {
            totalPrice = cart.totalPrice;
            let productCart = await models.ProductCart.findOne({
                where: {
                    cartId: cart.id,
                    productId: product.id
                }
            });
            if (productCart === null) {
                await models.ProductCart.build({
                    cartId: cart.id,
                    productId: product.id,
                    totalPrice: product.price,
                    totalQty: 1
                }).save();
            } else {
                await productCart.update({
                    totalQty: productCart.totalQty + 1
                });
            }

            productsCart = await models.ProductCart.findAll({
                where: {
                    cartId: cart.id,
                },
                include: [{
                    model: models.Product,
                    as: 'product'
                }]
            });
        }
        return await res.render('shop/shopping-cart',
            {
                totalPrice: totalPrice,
                productsCart: productsCart
            });
    } catch (err) {
        console.log('Http error', err);
        return res.status(500).send();
    }


});


module.exports = router;
