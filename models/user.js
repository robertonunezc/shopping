'use strict';
var bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
    var User = sequelize.define('User', {
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                validate: {
                    isEmail: true
                }
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
            }
        }, {
            setterMethods: {
                encryptPassword(password) {
                    let newPass = bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
                    this.setDataValue('password', newPass);
                },
            }
        }
    );
    User.associate = function (models) {
        User.hasMany(models.Order)
    };
    return User;
};