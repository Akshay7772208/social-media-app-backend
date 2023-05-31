const mongoose=require('mongoose')

module.exports= async ()=>{
	const mongoUrl='mongodb+srv://akshay:z3saVVzEsaBxyagU@cluster0.s5njwee.mongodb.net/?retryWrites=true&w=majority'
	
	try{
		const connect=await mongoose.connect(mongoUrl,{
			useUnifiedTopology: true,
			useNewUrlParser:true 
		})
		console.log('mongodb connected: ',connect.connection.host)
	}catch(e){
		console.log(e)
		process.exit(1)
	}
}