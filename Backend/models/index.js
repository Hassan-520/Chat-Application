const user = require('./user.model')
const Messages = require('./message.model')
const model = {
    user,
    Messages
}
Messages.belongsTo(user,{ as: 'sender', foreignKey: 'senderId' })
Messages.belongsTo(user,{ as: 'receiver', foreignKey: 'receiverId' })
module.exports = model