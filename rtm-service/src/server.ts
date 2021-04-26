import { Socket } from "socket.io";
import SocketController from "./controller/sockets";
import { DataContainer } from "./model/DataContainer";
// import { DataContainer } from "./model/DataContainer";
import { SKT_EVT } from "./model/SocketEventEnum";

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

io.on(SKT_EVT.CONNECTION, (s: Socket) => { socketController.onConnect(io, s) })


server.listen(port, () => console.log(`Listening on port ${port}`));