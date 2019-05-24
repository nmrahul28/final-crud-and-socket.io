const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
const dbConfig = require('./config/database.js');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const io = require('socket.io');
const server = http.createServer(app);
const socketIo = io(server);
const chats=require('./app/model/model.js');
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    next();
});
app.use(cors());

mongoose.connect(dbConfig.url, {
    useNewUrlParser: true
}).then((db) => {
    console.log("Successfully connected to the database");
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});
var users = {};

var clients = []
// Setup socket.io
socketIo.on('connection', socket => {
    console.log(socket.handshake.query)
    var username = socket.handshake.query.username || ' ';
    var userID = socket.handshake.query.userID || ' ';
    username = username.trim();
    userID = userID.trim();
    // const sendTo = socket.handshake.query.sendTo;
    console.log(`${username} id : ${userID}connected`);
    clients.push(username);
    users[username] = socket;
    clients = [...new Set(clients)];
    socket.on('client:message', data => {
        console.log(data.sendToID)
        var userSocket = users[data.sendTo] || null;
        console.log(userSocket)
        console.log(`${data.username}: ${data.message}`);
        chats.Chat_model.findOne({ 
            $and:[
                {$or: [{ 'user': userID }, { 'sender': userID}]}, 
                {$or: [{ 'user': data.sendToID  }, { 'sender': data.sendToID  }]}
            ] 
        })
        // findOne({ $and:[{$or: [{ 'user': userID }, { 'user': data.sendToID }], $or: [{ 'sender': userID }, { 'sender': data.sendToID }]}] })
            .exec((err, chat) => {
                if (err) {
                    console.log("No data found")
                } else {

                    if (chat === null) {
                        console.log(data.message);
                        let newChat = new chats.Chat_model();
                        newChat.user = userID;
                        newChat.sender = data.sendToID;
                        newChat.messages={'text' : data.message,'name':username};
                        // console.log(newChat.messages.text )
                        // newChat.messages.name = username;
                        console.log(newChat);
                        newChat.save((err, users) => {

                            if (err) {
                                console.log(err)
                                //res.send(err)
                            } else {
                                console.log(users);
                                // res.send(users);
                            }
                        })
                    } else {
                        console.log(chat)
                        chats.Chat_model.findOneAndUpdate({ '_id': chat._id }, {
                            $push: {
                                messages:
                                {
                                    'name': username,
                                    'text': data.message
                                }
                            }
                        }, { new: true }, (err, element) => {
                            if (err) {
                                // res.send(console.log(chat))
                                console.log(chat)
                            } else {
                                console.log(element)
                                // res.send(element);
                            }
                        })
                        console.log("fetched chats")
                        // res.send(user)
                    }

                }

            })
        if (userSocket) {
            if (userID !== data.sendID) {
                console.log(userID)
                console.log(data.sendToID)
                userSocket.emit('server:message', data);

            }
            console.log("Message was succefully sent!");
        } else {
            console.log('User socket unavailable');
        }
    });
    socket.on('disconnect', () => {
        clients.pop();
        console.log(`${username} disconnected`);
    });
});

app.get('/', (req, res) => {
    res.json({ "message": "This is Home Page" });
});

require('./app/routes/routes.js')(app);

server.listen(8081, () => {
    console.log("Server is listening on port 8081");
});