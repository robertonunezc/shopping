'use strict';
module.exports = (sequelize, DataTypes) => {
    let Product = sequelize.define('Product', {
        imagePath: DataTypes.STRING,
        title: DataTypes.STRING,
        descripcion: DataTypes.TEXT,
        price: DataTypes.FLOAT
    });
    Product.associate = function (models) {
        Product.belongsToMany(models.Cart,{
            through: models.ProductCart
        })
    };
    return Product;
};
