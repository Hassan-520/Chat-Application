var {Sequelize} = require("sequelize")
const sequelize = new Sequelize({
    host:'localhost',
    username: 'admin',
    password : "hassan123",
    database: 'chat_application',
    dialect: 'postgres',
   pool:{
    max:5,
    min:0,
    acquire:30000,
    idle:10000
   }
});


async () => {
   sequelize.sync();
}


module.exports = sequelize;