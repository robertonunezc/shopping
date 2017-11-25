var express = require('express');
var router = express.Router();
var models = require('../models');
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

module.exports = router;
