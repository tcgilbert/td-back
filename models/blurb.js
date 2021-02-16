'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class blurb extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  blurb.init({
    heading: DataTypes.STRING,
    content: DataTypes.STRING(1234),
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'blurb',
  });
  return blurb;
};