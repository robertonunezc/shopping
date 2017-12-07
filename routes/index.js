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
    const productsCart = [];
    let totalPrice = 0;
    models.Product
        .findById(productId)
        .then(product => {
            //buscamos el carrito
            models.Cart.findOne({where: req.user.id})
        })
        .then(cart => {
            if (cart === null) {
                //creamos el carrito nuevo
                let newCart = models.Cart
                    .build({
                        UserId: userId,
                        totalPrice: product.price,
                        totalQty: 1
                    })
                    .save()
                    .then(cart => {
                        //creamos el ProductoCart
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
                models.ProductCart.findAll({
                    where: {cartId: cart.id},
                    include: [{
                        model: models.Product,
                        as: 'product'
                    }]
                });
            }
            return res.render('shop/shopping-cart',
                {
                    totalPrice: totalPrice,
                    productsCart: productsCart
                })

        })
    ;


});


module.exports = router;
