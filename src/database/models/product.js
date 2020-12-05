/* eslint-disable no-unused-vars */
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      Product.belongsToMany(models.Cart, {
        as: 'products',
        through: models.CartItem,
        foreignKey: 'productId',
        otherKey: 'cartId',
      });
    }
  }

  Product.init(
    {
      title: { type: DataTypes.STRING, allowNull: false, validate: { notEmpty: true } },
      subtitle: DataTypes.STRING,
      description: DataTypes.STRING,
      price: DataTypes.DECIMAL(12, 2),
    },
    {
      sequelize,
      modelName: 'Product',
    }
  );

  return Product;
};
