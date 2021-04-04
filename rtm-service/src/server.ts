import { Socket } from "socket.io";
import SocketController from "./controller/sockets";
import { DataContainer } from "./model/DataContainer";
import { JoinRoomData } from "./model/JoinRoomData";
import { SendMessageData } from "./model/SendMessageData";

const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const port = process.env.PORT || 3001;
const cors = require("cors");
require('dotenv').config()

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: { origin: '*' }
});

app.use(cors());

app.get("/", (_req: any, res: any) => {
    res.send({ response: "I am alive" }).status(200);
});

const dataContainer: DataContainer = new DataContainer()
const socketController = new SocketController(dataContainer);

io.on('connection', (socket: Socket) => {
    console.log('A new user connected', socket.id);

    const uid: string = socket.handshake.query.uid + ''
    dataContainer.createUser(uid, socket)

    socket.on('join_room', (d: JoinRoomData) => socketController.joinRoom(socket, d))
    socket.on('send_message', (d: SendMessageData) => socketController.sendMessage(io, socket, d))

    socket.on('disconnect', () => {
        console.log("User disconnected", socket.id)
    })
})


server.listen(port, () => console.log(`Listening on port ${port}`));