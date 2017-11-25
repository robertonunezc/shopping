'use strict';
let Cart = (sequelize, DataTypes) => {
    return sequelize.define('Cart', {
        totalPrice: DataTypes.FLOAT,
        totalQty: DataTypes.FLOAT
    });
};
module.exports = Cart;
