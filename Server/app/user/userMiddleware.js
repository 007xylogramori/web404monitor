const userSchema = require("./userSchema");

const verifyAccessToken=async (req,res,next)=>{
    const token=req.headers.authorization;    
    if(!token){
        res.status(400).json({
            status:false,
            message:"token not found",
        })

    return;
    }

    const user=await userSchema.findOne({
        "tokens.accessToken.token":token
    });

    if(!user){
        res.status(422).json({
            status:false,
            message:"wrong access token",
        })
        return;
    }

    const expiry = new Date(user.tokens.accessToken.expireAt);
    if (expiry < new Date()) {
        res.status(422).json({
                status: false,
                message: "Token expired",
            });
        return;
    }

    req.user=user;
    next();
}

module.exports=verifyAccessToken;