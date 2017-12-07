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

router.get('/add-to-cart/:id', middlewares.isLoggedIn, function (req, res, next) {
    const productId = req.params.id;
    const userId = req.user.id;
    let productsCart = [];
    let totalPrice = 0;
    // buscamos si el producto existe
    models.Product
        .findById(productId)
        .then(product => {
            //buscamos el carrito
            models.Cart.findOne({
                where: {
                    UserId: req.user.id
                }
            })
                .then(cart => {
                    if (cart === null) {
                        //creamos el carrito nuevo
                        models.Cart
                            .build({
                                UserId: userId,
                                totalPrice: product.price,
                                totalQty: 1
                            })
                            .save()
                            .then(cart => {
                                //creamos el ProductoCart con el producto a agregar
                                models.ProductCart.build({
                                    cartId: cart.id,
                                    productId: productId,
                                    totalPrice: product.price,
                                    totalQty: 1
                                })
                                    .save()
                                    .then(productcart => {
                                        productsCart.push(productcart)
                                    })
                            })


                    }
                    if (cart !== null) {
                        totalPrice = cart.totalPrice;
                        //buscar el ProductCart de el producto que queremos agregar en el carrito q existe

                        models.ProductCart.findOrCreate({
                            where: {
                                cartId: cart.id,
                                productId: product.id
                            },
                            defaults: {
                                cartId: cart.id,
                                productId: product.id,
                                totalPrice: product.price,
                                totalQty: 1
                            }
                        }).spread((productCart, created) => {
                            if (!created) {
                                productCart.update({
                                    totalQty: productCart.totalQty + 1
                                })
                            }
                        });
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
                        ;
                    }
                })
        })

    ;


});


module.exports = router;
