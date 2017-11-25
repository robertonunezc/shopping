var models = require('../models');
const Sequelize = require('sequelize');
const sequelize = new Sequelize('postgres://postgres:postgres@localhost:5432/tienda_virtual');
sequelize
    .authenticate()
    .then(() => {
        var products = [
            models.Product.build({
                imagePath: 'http://liquidationsports.com/common/images/products/large/58767lrg.jpg',
                title: 'My First Product',
                descripcion: ' Description of my first product',
                price: 110
            }),
            models.Product.build({
                imagePath: 'http://liquidationsports.com/common/images/products/large/58767lrg.jpg',
                title: 'My First Product',
                descripcion: ' Description of my first product',
                price: 110
            }),
            models.Product.build({
                imagePath: 'http://liquidationsports.com/common/images/products/large/58767lrg.jpg',
                title: 'My First Product',
                descripcion: ' Description of my first product',
                price: 110
            }),
            models.Product.build({
                imagePath: 'http://liquidationsports.com/common/images/products/large/58767lrg.jpg',
                title: 'My First Product',
                descripcion: ' Description of my first product',
                price: 110
            })
        ];
        var done = 0;
        for (let i = 0; i < products.length; i++) {
            products[i].save().then(()=>{
                done++;
                if(done === products.length){
                    console.log('Finished product insert');
                    sequelize.close();
                }
            })
        }
    }).catch(err => {
    console.error('Unable to connect to the database:', err);
});
