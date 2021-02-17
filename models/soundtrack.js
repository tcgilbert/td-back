'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class soundtrack extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  soundtrack.init({
    spotifyId: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    comment: DataTypes.STRING,
    type: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'soundtrack',
  });
  return soundtrack;
};