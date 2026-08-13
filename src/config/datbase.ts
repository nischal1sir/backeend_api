import mongoose, { connect } from "mongoose"

const ConnectDb = async():Promise<void>=>{
try{
const connect=await mongoose.connect(process.env.MONGO_URL as string)
console.log(`Database Connect Succ:${connect.connection.host}`)

}catch(ex){
console.log(ex)
}
}
export default ConnectDb;