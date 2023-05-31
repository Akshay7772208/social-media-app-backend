const User=require('../models/User')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const {error} =require('../utils/responseWrapper')
const {success} =require('../utils/responseWrapper')

const signupController= async (req,res)=>{
	
	try{

		const {name,email,password}=req.body;
		if(!email || !password || !name){
			//return res.status(400).send('All fields are required')
			return res.send(error(400,"All fields are required"))
		}
		const oldUser=await User.findOne({email})
		if(oldUser){
			//return res.status(409).send('User is already registered ')
			return res.send(error(409,"User is already registered"))
		}

		const hashPassword=await bcrypt.hash(password,10);

		///storing the data
		const user=await User.create({
			name,
			email,
			password:hashPassword
		})
		//return res.status(201).json({user})
		return res.send(success(201,'user created'))
	
	}catch(e){
		return res.send(error(500,e.message))
	}
}

const loginController= async (req,res)=>{
	
	try{
		const {email,password}=req.body;
		if(!email || !password){
			//return res.status(400).send('All fields are required')
			return res.send(error(400,"All fields are required"))
			///console.log("All fields are required")
		}
		const user=await User.findOne({email}).select('+password')
		if(!user){
			//return res.status(404).send('User is not registered ')
			return res.send(error(404,"User is not registered"))
		}

		const matched=await bcrypt.compare(password,user.password)
		if(!matched){
			//return res.status(404).send('Incorrect password')
			return res.send(error(404,"Incorrect password"))
		}
		const accessToken=generateAccessToken(
			{_id:user._id}
		);
		
		const refreshToken=generateRefreshToken(
			{_id:user._id}
		);
		
		res.cookie('jwt',refreshToken,{
			httpOnly: true,
			secure: true
		})
		//return res.json({accessToken})
		return res.send(success(200,{accessToken}))
	}catch(e){
		return res.send(error(500,e.message))
	}
}

//this api will check refresh token validity and generate a new access token

const refereshAccessTokenController=async (req,res)=>{
	//const {refreshToken}=req.body;
	const cookies=req.cookies;

	if(!cookies.jwt){
		//return res.status(401).send("Refresh token in cookie is required")
		return res.send(error(401,"Refresh token in cookie is required"))
	}

	const refreshToken=cookies.jwt;
	console.log("refresh",refreshToken)
	
	try{
		const decoded=jwt.verify(
			refreshToken,
			process.env.REFRESH_TOKEN_PRIVATE_KEY
		)
		const _id=decoded._id
		const accessToken=generateAccessToken({_id})
		
		//return res.status(201).send({accessToken})
		return res.send(success(201,{accessToken}))
	}catch(e){
		console.log(e)
		//return res.status(401).send('error: Invalid refresh token')
		return res.send(error(401,"Invalid refresh token"))
		//console.log('invalid refresh token')
	}

}

const logoutController= async(req,res)=>{
	try{
		res.clearCookie('jwt',{
			httpOnly: true,
			secure: true
		})

		return res.send(success(200,'User logged out'))
	}catch(e){
		return res.send(error(500,e.message))
	}
}

const generateAccessToken=(data)=>{
	try{
		const token=jwt.sign(data,process.env.ACCESS_TOKEN_PRIVATE_KEY,{
			expiresIn: "1d"
		});
		console.log(token)
		return token
	}catch(e){
		console.log(e)
	}
}

const generateRefreshToken=(data)=>{
	try{
		const token=jwt.sign(data,process.env.REFRESH_TOKEN_PRIVATE_KEY,{
			expiresIn: "1y"
		});
		console.log(token)
		return token
	}catch(e){
		console.log(e)
	}
}

module.exports={
	signupController,
	loginController,
	refereshAccessTokenController,
	logoutController
}

///REFRESH_TOKEN_PRIVATE_KEY=39dce99d8f1756983fab2c30ee3f5d5f26dc83513928873782d73dea1536aa90884976d178542e88dd10c3d026f3d5432bcf81084cc67218a099d19016b79de4