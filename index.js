const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken')
const app = express();
var cors = require('cors')

/* START - DATABASE */
const mongoose = require('mongoose');
const { json } = require('body-parser');



const MONGO_URI = 'mongodb+srv://admin:admin@cluster0.ye5kd.mongodb.net/employees?retryWrites=true&w=majority'; 
mongoose.connect(MONGO_URI || "mongodb://localhost/employees",{ 
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: true
    })
    .then(()=>console.log('You are now connected to database!'))
    .catch((err) => console.log(err))

const EmployeeSchema = new mongoose.Schema({
    _id: Number, //Replace default ID in mongoDB
    name: String,
    age: Number,
    salary: Number
})

Employee = mongoose.model('Employee',EmployeeSchema) //Make a model using from that schemas

/* END - DATABASE*/ 

/* START - Enable CORS for all group */
app.use(cors());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
/* END - CORS */

/* START - REST APIs */
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

/* READ ALL */
// async/await
app.get("/api/employees",async (req,res,next) => {
    data = await Employee.find()
    res.json(data);
})

/* GET ONE */
app.get("/api/employees/:id", async (req,res,next) => {
    let id = req.params.id;
    data = await Employee.findById(id)
    res.json(data);
})


/* DELETE ONE */
app.delete("/api/employees/:id", async (req,res,next) => {
    let id = req.params.id;
    data = await Employee.findByIdAndRemove(id)
    res.json(data)
})

/* ADD ONE */
app.post("/api/employees", async(req,res,next) => {
    let new_object = req.body;
    data = await Employee.create(new_object);
    res.json(data)
})

/* UPDATE ONE */
app.put("/api/employees/:id",async (req,res,next) => {
    let updated_object = req.body;
    let id = req.params.id;
    data = await Employee.findByIdAndUpdate(id,updated_object,{new: true})
    res.json(data)
})

/* END - REST APIs */

/* START - JWT */

//Temporary username and pass
var userId = 1;
var username;
var password;

app.post('/register',(req,res) => {
    let user = req.body
    if(user==null || user==undefined) {
        console.log(err);
        res.status(401).send('No user found')
    }
    //Save the user and send them token
    username = user.username;
    password = user.password;
    let payload = {subject:userId} 
    let token = jwt.sign(payload, 'secretKey')
    res.status(200).send({'msg':'You have been succesfully register!'})    
})

app.post('/login',(req,res) => {
    let user = req.body
    if(user==null || user==undefined) {
        console.log(err);
        res.status(401).send('No user found')
    }
    //Save the user and send them token

    if(user.username==username && user.password==password){
        let payload = {subject:userId} 
        let token = jwt.sign(payload, 'secretKey')
        res.status(200).send({token})
    } else {
        res.status(400).send({"msg":"Login Failed!"})
    }
})

function verifyToken(req, res, next) {
    if(!req.headers.authorization) {
      return res.status(401).send('Unauthorized request')
    }
    let token = req.headers.authorization.split(' ')[1]
    if(token === 'null') {
      return res.status(401).send('Unauthorized request')    
    }
    let payload = jwt.verify(token, 'secretKey')
    if(!payload) {
      return res.status(401).send('Unauthorized request')    
    }
    req.userId = payload.subject
    next()
}

//Getting data with this route need a token
app.get('/user',verifyToken,(req,res) => {
    data = {
        "msg":`Only authorized user can see this information`,
        "userId":`You id is ${userId}`,
        "user":`You username is ${username}`,
    }
    res.json(data)
})
/* END - JWT */

// app.use(express.static(path.join(__dirname,"templates")))

const PORT = process.env.PORT || 3000;
app.listen(PORT,() => `Server is listening on ${PORT}`);

//STEP 3
if(process.env.NODE_ENV == 'production') {
    app.use(express.static('./client/dist/client'))
}
