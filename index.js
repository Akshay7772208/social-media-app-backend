const express=require('express')
const dotenv=require('dotenv')
const dbConnect=require('./dbConnect')
const authRouter=require('./routers/authRouter')
const morgan=require('morgan')
const jwt=require('jsonwebtoken')
const postRouter=require('./routers/postRouter')
const userRouter=require('./routers/userRouter')
const cookieParser=require('cookie-parser')
const cors=require('cors')
const cloudinary = require('cloudinary').v2;

const bodyParser=require('body-parser')

dotenv.config('./.env')

// Configuration 
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});


const app=express()

///middlewares
app.use(express.json({limit:'10mb'}))
app.use(morgan('common'))
app.use(cookieParser())
app.use(cors()
)
app.use(
	express.urlencoded({extended: true})
)
app.use(bodyParser.urlencoded({extended: true}))

app.use('/auth',authRouter)
app.use('/posts',postRouter)
app.use('/user',userRouter)

app.get('/',(req,res)=>{
	res.status(200).send("OK from Server")
})


const PORT=process.env.PORT || 4001;
//const PORT=4001
dbConnect()
app.listen(PORT,()=>{
	console.log(`listening on port: ${PORT}`)
})

//z3saVVzEsaBxyagU
