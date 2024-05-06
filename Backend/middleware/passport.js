const passport = require('passport')
const model = require('../models/index')
const JwtStrategy = require("passport-jwt").Strategy;
const { ExtractJwt } = require("passport-jwt");
var opts = {
    jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: "QLU_CHAT_APPLICATION"
}
passport.use(
    new JwtStrategy(opts, async function (jwt_payload,done){
        try {
            var user = await model.user.findOne({where: {email: jwt_payload.email}});
            user = user.dataValues
            if (user){
                return done(null,user)
            }else{
                return done(null,false)
            }
        } catch (error) {
            return done(error,false)
        }
    })
)
passport.isAdmin = async (req, res, next) => {
    try {
        if (!req.user || req.user.role !== 'admin') {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized Access',
            });
        }
        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Error in Admin Middleware',
            error,
        });
    }
};


module.exports = passport;