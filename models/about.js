'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class about extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  about.init({
    name: DataTypes.STRING,
    nameShow: DataTypes.BOOLEAN,
    location: DataTypes.STRING,
    locationShow: DataTypes.BOOLEAN,
    work: DataTypes.STRING,
    workShow: DataTypes.BOOLEAN,
    pictureId: DataTypes.STRING,
    picture: DataTypes.STRING,
    fileName: DataTypes.STRING,
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'about',
  });
  return about;
};