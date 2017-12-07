'use strict';
module.exports = (sequelize, DataTypes) => {
    let Product = sequelize.define('Product', {
        imagePath: DataTypes.STRING,
        title: DataTypes.STRING,
        descripcion: DataTypes.TEXT,
        price: DataTypes.FLOAT
    });

    return Product;
};
