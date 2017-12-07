'use strict';
module.exports = (sequelize, DataTypes) => {
    let ProductCart = sequelize.define('ProductCart', {
        totalPrice: DataTypes.FLOAT,
        totalQty: DataTypes.FLOAT
    });
    ProductCart.associate = function (models) {
        ProductCart.belongsTo(models.Cart, {as: 'cart'});
        ProductCart.belongsTo(models.Product, {as: 'product'})
    };
    return ProductCart;
};
