import jwt from 'jsonwebtoken'

const auth = async (req,res,next)=>{
    const token = req.header('Authorization')?.replace('Bearer','');

    if(!token){
        return res.status(401).json({success:false,message:"Unauthorized"})
    }

    try {
        const decoded = jwt.verify(token,process.env.SECRET_KEY)
        req.user = {userId:decoded.id}
        next()

    }
    catch (error){
        console.log(error)
        res.status(500).json({success:false,message:"Internal server error"})
    }
}

export default auth;