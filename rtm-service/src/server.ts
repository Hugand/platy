import { Server, Socket } from "socket.io";
import SocketController from "./controller/sockets";
import { DataContainer } from "./model/DataContainer";
// import { DataContainer } from "./model/DataContainer";

import express from "express";
import http from "http";
const port = process.env.PORT || 3001;
import cors from "cors";
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: '*' }
});

app.use(cors());
app.get("/", (_req: any, res: any) => {
    res.send({ response: "I am alive" }).status(200);
});

const dataContainer: DataContainer = new DataContainer()
const socketController = new SocketController(dataContainer);

io.on('connection', (socket: Socket) => {
    socketController.onConnect(io, socket)
});

server.listen(port, () => console.log(`Listening on port ${port}`));
