import { response } from "express";

const fetch_ = require("node-fetch");
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const port = process.env.PORT || 3001;
const cors = require("cors");

require('dotenv').config()

const app = express();

const server = http.createServer(app);

const io = socketIo(server, {
    cors: {
        origin: '*',
    }
});
app.use(cors());

app.get("/", (req: any, res: any) => {
    res.send({ response: "I am alive" }).status(200);
});

type User = {
    socketSession: any
    uid: string
    roomId: string | null
}

const users: Map<string, User> = new Map<string, User>()
const rooms: Map<string, Array<string>> = new Map<string, Array<string>>()


io.on('connection', (socket: any) => {
    console.log('A new user connected', socket.id);
    const uid: string = socket.handshake.query.uid

    const newUser: User = {
        socketSession: socket,
        uid,
        roomId: null
    }

    users.set(uid, newUser)

    socket.on('join_room', async (data: any) => {
        const isTokenValid: boolean = await validateToken(data)

        if(isTokenValid) {
            let user: User | undefined = users.get(data.uid)
    
            if(user !== undefined) {
                user.roomId = data.roomId
                users.set(user.uid, user);

                // Create room
                if(!rooms.has(data.roomId)) {
                    rooms.set(data.roomId, new Array<string>())
                }

                // Assign user to room
                rooms.get(data.roomId)!.push(user.uid)

                // Get friendship chats
                let friendshipId: number = parseInt(data.roomId.substring(1))
                try {
                    let chatsList: any = await fetch_(`${process.env.REST_SERVICE_URL}/getChatFromFriendship?friendshipId=${friendshipId}`, {
                            headers: {
                                'Authorization': 'Bearer ' + data.token
                            }
                        }).then((res: any) => res.json())
                    console.log("=> ", chatsList)
                    socket.emit('message', JSON.stringify({
                        status: 'ok',
                        msg: chatsList
                    }))
                } catch (e) {
                    console.log(e)
                    socket.emit('message', JSON.stringify({
                        status: 'error',
                        msg: 'fetch_chats'
                    }))
                }
            } else
                socket.emit('message', JSON.stringify({
                    status: 'error',
                    msg: 'uid_invalid'
                }))
        } else
            socket.emit('message', JSON.stringify({
                status: 'error',
                msg: 'token_invalid'
            }))
    })

    socket.on('disconnect', () => {
        console.log("User disconnected", socket.id)
    })
})

async function validateToken(data: any): Promise<boolean> {
    console.log("--> ", data)
    
    try {
        const res: any = await fetch_(`${process.env.REST_SERVICE_URL}/validateToken?token=${data.token}&uid=${data.uid}`).then((r: any) => r.json())
        console.log("aa>",res)
        return res.status
    } catch(e) {
        console.log(e)
        return false;
    }
}

server.listen(port, () => console.log(`Listening on port ${port}`));