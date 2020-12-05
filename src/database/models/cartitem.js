/* eslint-disable no-unused-vars */
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class CartItem extends Model {
    static associate(models) {}
  }

  CartItem.init(
    {
      cartId: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        references: {
          model: 'Carts',
          key: 'id',
        },
      },
      productId: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        references: {
          model: 'Products',
          key: 'id',
        },
      },
      quantity: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      sequelize,
      modelName: 'CartItem',
    }
  );

  return CartItem;
};
