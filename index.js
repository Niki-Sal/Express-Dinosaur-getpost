const express = require("express")
const app = express()
const expressLayouts = require("express-ejs-layouts")
//filesystem module
const fs = require ("fs")
const methodOverride = require("method-override")

/////Not neccessary
const bodyParser = require('body-parser')
const ejs = require("ejs")


//MiddleWare
//this will help us use our layout file
app.use(expressLayouts)
//this will help us use our method override
app.use(methodOverride("_method"))

///// these two necessary instead of above ejs and bodyparser
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
    console.log(req.query.nameFilter)
    let nameToFilterBy = req.query.nameFilter
    //array methof filter
    //if somebody didn't want to filter and submit
    //this will be undefines and we will return all dinos
    if (nameToFilterBy) {
        const newFilteredArray = dinos.filter((dinosaurObj)=> {
            if (dinosaurObj.name.toLowerCase() === nameToFilterBy){
                return true
            }
        })
        dinos = newFilteredArray
        console.log(newFilteredArray)
    }
    
    //in our views folder render this page and give us a vriable to work with
    res.render("dinosaurs/index", {dinos: dinos})
})

// NEW view
//Most specific url path comes before /dinosaurs/:index///////IMPORTANT
app.get("/dinosaurs/new", (req,res)=>{

    res.render("dinosaurs/new")
})

app.get("/dinosaurs/edit/:idx", (req, res)=>{
    const dinosaurs = fs.readFileSync ("./dinosaurs.json")
    const dinosaursArray = JSON.parse(dinosaurs)

    let idx = Number(req.params.idx)
    const ourDino = dinosaursArray[idx]

    res.render("dinosaurs/edit",{dino: ourDino, idx: idx})
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
    //this is coming from our form submit (name= "name" and name= "type")
    //we are going to look at the req.body
    // console.log(req.body)
    // get data
    let dinos = fs.readFileSync("./dinosaurs.json")
    // take our data and put it in a more readable format
    dinos = JSON.parse(dinos)
    //construct  a new dino with our req.body values
    const newDino = {
        name: req.body.name,
        type: req.body.type
    }
    dinos.push(newDino)
    fs.writeFileSync("./dinosaurs.json", JSON.stringify(dinos))
    // get a request to /dinosaurs
    res.redirect("/dinosaurs")
   
})

//delete route
app.delete('/dinosaurs/:idx', (req, res) => {
    const dinosaurs = fs.readFileSync('./dinosaurs.json');
    const dinosaursArray = JSON.parse(dinosaurs);
    // intermediate variable
    let idx = Number(req.params.idx); // what is this datatype? comes in as a string, change to integer
    // remove the dinosaur
    dinosaursArray.splice(idx, 1);
    // save the dinosaurs array into the dinosaurs.json file
    fs.writeFileSync('./dinosaurs.json', JSON.stringify(dinosaursArray));
    // redirect back to /dinosaurs route
    res.redirect('/dinosaurs');
});

//put route (update)

app.put("/dinosaurs/:idx", (req, res)=>{
    //the goal of this route is to update a dinasaur
    const dinosaurs = fs.readFileSync("./dinosaurs.json")
    const dinosaursArray = JSON.parse(dinosaurs)
    // set up the index
    let idx = Number(req.params.idx)
    const ourDino = dinosaursArray[idx] //what datatype is this? Object
    //update the dino
    ourDino.name = req.body.name
    ourDino.type = req.body.type
    //rewrite file dinosaur.json
    fs.writeFileSync('./dinosaurs.json', JSON.stringify(dinosaursArray));
    //redirect them back to another page (/dinosaurs)
    res.redirect('/dinosaurs');

})


const PORT = process.env.PORT || 8000
app.listen(PORT, () =>{
    console.log(`Server is running on port ${PORT}`)
})