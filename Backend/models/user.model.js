const { DataTypes } = require('sequelize')
const sequelize = require('../config/db.config')
const User = sequelize.define('User', {
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    }, 
    display_name:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    profile_img: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    status:{
        type:DataTypes.BOOLEAN,
        defaultValue: false
    },
    bio:{
        type:DataTypes.STRING,
        allowNull:true
    }
}, {
    paranoid: true,
});
module.exports = User;