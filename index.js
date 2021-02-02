const express = require("express")
const app = express()
const expressLayouts = require("express-ejs-layouts")
const fs = require ("fs")
const ejs = require("ejs")
const bodyParser = require('body-parser')

//MissleWare
//this will help us use our layout file
app.use(expressLayouts)
app.use(express.urlencoded({extended: false}));
// for views use .ejs files
app.set("view engine", "ejs")

// ROUTES
app.get("/", (req, res) =>{
    res.send("Hi there")
})

//index View
app.get("/dinosaurs", (req, res) =>{
    // get data
    let dinos = fs.readFileSync("./dinosaurs.json")
    // take our data and put it in a more readable format
    dinos = JSON.parse(dinos)
    console.log(dinos)
    //in our views folder render this page and give us a vriable to work with
    res.render("dinosaurs/index", {dinos: dinos})
})

// NEW view
//Most specific url path comes before /dinosaurs/:index///////IMPORTANT
app.get("/dinosaurs/new", (req,res)=>{

    res.render("dinosaurs/new")
})


//SHOW view
app.get("/dinosaurs/:index", (req, res) =>{
    // get data
    let dinos = fs.readFileSync("./dinosaurs.json")
    // take our data and put it in a more readable format
    dinos = JSON.parse(dinos)
    //get the dino that's asked for
    //req.params.index
    const dino = dinos[req.params.index]
    res.render("dinosaurs/show", { dino })
})



//POST route, doesn't have a view
app.post("/dinosaurs", (req, res)=>{
    //this is coming from our form submit
    //we are going to look at the req.body
    console.log(req.body)
})


const PORT = process.env.PORT || 8000
app.listen(PORT, () =>{
    console.log(`Server is running on port ${PORT}`)
})