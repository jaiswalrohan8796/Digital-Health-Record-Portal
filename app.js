//require
const express=require("express");
const path = require("path");
const ejs = require("ejs");

//configuration
const port=process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(express.urlencoded(false));


app.set("view engine","ejs");
app.set("views","views");

app.get("/",(req,res,next)=>{
    res.render("home",{
        name:""
    })

})

app.listen(port,()=>{console.log(`I am listing to ${port}`)});
