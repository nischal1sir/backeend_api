import express, {Application,Request,Response} from "express"

const app:Application=express()

app.use(express.json())
app.use(express.urlencoded())
import routes from "./routes/index"
app.use("/api/v1",routes)


app.get("/",(req:Request,res:Response)=>{
    res.status(200).json({
        mesage:"hi"    
    })  
})

export default app;