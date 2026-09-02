import express, {Application,Request,Response} from "express"
import path from "path"
import fs from "fs"
const app:Application=express()

app.use(express.json())
app.use(express.urlencoded({extended:true}));
import routes from "./routes/index"
app.use("/api/v1",routes)
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/",(req:Request,res:Response)=>{
    fs.readdir(`/Files`,function(err,Files){
        res.render("index",{Files:Files})
    })
})

export default app; 