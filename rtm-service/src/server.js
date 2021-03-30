"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var sockets_1 = __importDefault(require("./controller/sockets"));
var DataContainer_1 = require("./model/DataContainer");
var express = require("express");
var http = require("http");
var socketIo = require("socket.io");
var port = process.env.PORT || 3001;
var cors = require("cors");
require('dotenv').config();
var app = express();
var server = http.createServer(app);
var io = socketIo(server, {
    cors: {
        origin: '*',
    }
});
app.use(cors());
app.get("/", function (req, res) {
    res.send({ response: "I am alive" }).status(200);
});
var dataContainer = new DataContainer_1.DataContainer();
var socketController = new sockets_1.default(dataContainer);
io.on('connection', function (socket) {
    console.log('A new user connected', socket.id);
    var uid = socket.handshake.query.uid + '';
    dataContainer.createUser(uid, socket);
    socket.on('join_room', function (d) { return socketController.joinRoom(socket, d); });
    socket.on('send_message', function (d) { return socketController.sendMessage(io, socket, d); });
    socket.on('disconnect', function () {
        console.log("User disconnected", socket.id);
    });
});
server.listen(port, function () { return console.log("Listening on port " + port); });
