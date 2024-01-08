const express = require('express')
const app = express()

const User = require('./Schema');
const mongoose = require('mongoose');

const cors = require('cors');
app.use(express.json())

const { log } = require('console');

const jwt = require('jsonwebtoken')

const dotenv = require('dotenv');
dotenv.config({path:'./config.env'});

const URI = process.env.URI;
const PORT = process.env.PORT;
const SECRET_KEY = process.env.SECRET_KEY;

const http = require('http');
const socketIo = require('socket.io');
const server = http.createServer(app);
app.use(cors());

mongoose.connect(URI)
.then(log("MongoDB Connected"))
.catch(console.log())

app.post('/savedata',async(req,res)=>{
    const details = req.body;
    try {
        const isAvailable = await User.findOne({email:details.email});
        if(!isAvailable)
        {
            const user = new User(details);
            user.save();
            res.status(200).json({code:1,msg:"Registered"})
        }
        else
        {
            res.status(400).json({code:0,msg:"Email Already Exists"})
        }
    } catch (error) {
        log(error)
    }
})

app.post('/login',async(req,res)=>{
    const details = req.body;
    try {
        const data = await User.findOne({email:details.email});
        if(data)
        {
            if(data.password === details.password)
            {
                const email = data.email;
                const newToken = jwt.sign({email},SECRET_KEY,{expiresIn:'5m'})
                res.status(200).json({msg:"Login Successfull",code:1,token:newToken})
            }
            else
            {
                res.status(400).json({code:0,msg:"Incorrect Password"})
            }
        }
        else
        {
            res.status(400).json({msg:"Incorrect Email",code:0})
        }
    } catch (error) {
        res.status(500).json(error);
    }

})


const io = socketIo(server, {
    cors: {
      origin: 'http://localhost:3000', https://thumb-stack-task-chatapp.vercel.app/chat
      methods: ['GET', 'POST'],
    },
  });

// Socket IO Connections

var activeUsers = [];

io.on("connection",(socket)=>{

    socket.on("login",(username)=>{
        if(!activeUsers.includes(username))
        {
            activeUsers.push(username);
            io.emit("activeUsers",activeUsers)
        }
    });

    socket.on("sendMessage",(message)=>{
        io.emit("receivedMessage",message)
    });

    socket.on("logout",(user)=>{
        const users = activeUsers;
        activeUsers = users.filter((u,i)=>{
            return u!==user
        })
        io.emit("loggedOut",activeUsers)
    })

})

server.listen(PORT, () => {
    console.log("Socket io server running on port:",PORT)
})
