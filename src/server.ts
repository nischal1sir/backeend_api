import ConnectDb from "./config/datbase";
import app from "./app"
import dotenv from "dotenv"

dotenv.config()

const PORT=process.env.PORT || 8000

ConnectDb()

app.listen(PORT,()=>{
 console.log(`Server Start:${PORT}`)
})