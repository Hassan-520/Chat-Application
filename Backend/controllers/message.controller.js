const model = require('../models/index')
const { Op } = require('sequelize');


exports.send_message = async(req,res)=>{
    try{
        const { from, to, message } = req.body;
        const data = await model.Messages.create({
            message: { text: message },
            sender: from,
            reciever: to,
        });
        if (data){
            res.status(200).send({
                success:true,
                message:"Message Sending Successfully",
                data
            })
        }
        else{
            res.status(400).send({
                success:true,
                message:"Something Went Wrong in sending a message",
            })
        }
    }catch(error){
        console.error("Error in sending Message...",error)
        res.status(500).send({
            success:false,
            message:"Error in sending a message",
            error
        })
    }
}

module.exports.getMessages = async(req,res)=>{
    try{
        const { from, to } = req.body;
        const messages = await model.Messages.findAll({
            where: {
                [Op.or]: [
                    { senderId: from, receiverId: to },
                    { senderId: to, receiverId: from }
                ]
            },
            order: [['updatedAt', 'ASC']]
        });
        const projectedMessages = messages.map((msg) => {
            return {
              fromSelf: msg.sender.toString() === from,
              message: msg.message.text,
            };
        });
        res.status(200).send({
            success:true,
            message:"Message Retrieved",
            data:projectedMessages
        })
    }catch(error){
        console.error("Error in sending Message...",error)
        res.status(500).send({
            success:false,
            message:"Error in sending a message",
            error
        })
    }
}