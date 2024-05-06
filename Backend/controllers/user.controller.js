const model = require('../models/index')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {z} = require('zod')


// The function is to validate the schema with the help of zod I have created an object now with this object I have to validate and save into database
const validation_schema = z.object({
    email:z.string().email(),
    display_name:z.string(),
    username : z.string(),
    password:z.string().min(8)

})
// The function generates a token when user will login 
const generate_token = (user) => {
    // Now first thing we destructure the user and select some attributes or elements to generate the token
    const {email,id,role} = {...user}
    const payload = {email,id,display_name};
    return jwt.sign(
      payload, 
      'QLU_CHAT_APPLICATION', 
      { 
        expiresIn: '7d' 
      });
  }
  


// The below controllers helps user to be a part of our interactive chat application
exports.register_user = async(req,res)=>{
    try{
        // now first we take the request body and parse from validation schema and also check user exist or not to use unique 
        //in email the user would be unique and befor return I was sanitze the password from user data to make sure that user credential would be saved.
        var userData = req.body;
        userData =  validation_schema.parse(req.body)
        const existingUser = await model.user.findOne({ where: { email: userData.email } });
        if (existingUser) {
            return res.status(400).send({ 
                success:false,
                message:"User Already Exist"
            });
        }
        // Add '@' at the beginning of the username
        if (!userData.username.startsWith('@')) {
            userData.username = '@' + userData.username;
        }
        // hashing the password to secure the user password from stealing
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(userData.password, salt);
        userData.password = hashedPassword
        const newUser = await model.user.create(userData);
        // password is sanitize from user values 
        const {password, ...user} = newUser.dataValues
        res.status(200).send({ 
            success:true,
            message:"User Added Successfully",
            data:user
        });
    }catch(error){
        console.error("Error in user registration...",error)
        res.status(500).send({
            success:false,
            message:"Server Error in user registration...",
            error
        })
    }
}
// This is the controller for user login
exports.login_user = async(req,res)=>{
    try{
        // finding the user in the database with the help of email
        const user = await model.user.findOne({ where: { email: req.body.email } });
        if (!user) {
            return res.status(401).send({ success: false,
                message: 'Invalid Credentials', });
        }
        // as we know password is not hashed values did not be decrypted so we need to compare it
        const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
        if (!isPasswordValid) {
            return res.status(401).send({ error: 'Invalid credentials.' });
        }
        //now if the user credentials are correct then status should be true because he was open their account and its status should be online
        user.status = true;
        await user.save();
        // now generate the token with the help of user values
        const token = generate_token(user.dataValues)
        res.status(200).send({ 
            success:true,
            message:"Successfully Logged in",
            username: user.username,
            display_name:user.display_name,
            id: user.id,
            status:user.status,
            token 
        });
    }catch(error){
        console.error("Error in user login...",error)
        res.status(500).send({
            success:false,
            message:"Server Error in user login...",
            error
        })
    }
}

exports.edit_user = async(req,res)=>{
    try{
        // first we need to get the user id with this id the user will be finding in database after that the updated value from request body save in database
        const user_id = req.params.id;
        const user = await model.user.findOne({user_id});
        if (!user) {
            return res.status(404).send({ 
                success:false, 
                message:"User Not Found"
            });
        }
        user.display_name = req.body.display_name || user.display_name
        user.username = req.body.username || user.username
        user.bio = req.body.bio||user.bio
        user.phone = req.body.phone||user.phone
        await user.save()
        res.status(200).send({
            success:true,
            message:"User Edited Successfully",
            data:user
        })
    }catch(error){
        console.error("Error in user editing...",error)
        res.status(500).send({
            success:false,
            message:"Server Error in user editing...",
            error
        })
    }
}
exports.upload_profile = async(req,res)=>{
    try{
        const user_id = req.params.id;
        const user = await model.user.findByPk(user_id)
        if (!user) {
            return res.status(404).send({ 
                success:false, 
                message:"User Not Found"
            });
        }
        const profileImage = req.file ? req.file.filename : ''
        if (!profileImage) {
            return res.status(400).json({
                success:false,
                message: "Profile Image is required to upload"
             });
            }
            user.profile_img = profileImage;
            await user.save();
            return res.status(200).send({
                success:true,
                message:"Successfully Uploaded Image"

            })
    }catch(error){
        console.error("Error in uploading a file...",error)
        res.status(500).send({
            success:false,
            message:"Server Error in uploading a file...",
            error
        })
    }
}
