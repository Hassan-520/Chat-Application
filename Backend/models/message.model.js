const { DataTypes } = require('sequelize')
const sequelize = require('../config/db.config')
const Messages = sequelize.define('Messages', {
    text:{
        type:DataTypes.STRING,
        allowNull: false

    }
}, {
    paranoid: true,
})
module.exports = Messages