'use strict';
module.exports = (sequelize, DataTypes) => {
  var ProductCart = sequelize.define('ProductCart', {
    totalPrice: DataTypes.FLOAT,
    totalQty: DataTypes.FLOAT
  });
  return ProductCart;
};
