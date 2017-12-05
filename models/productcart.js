'use strict';
module.exports = (sequelize, DataTypes) => {
  let ProductCart = sequelize.define('ProductCart', {
    totalPrice: DataTypes.FLOAT,
    totalQty: DataTypes.FLOAT
  });
  return ProductCart;
};
