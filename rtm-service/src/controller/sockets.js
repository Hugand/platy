"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const restServiceApi_1 = require("./restServiceApi");
const SocketEventEnum_1 = require("../model/SocketEventEnum");
class SocketController {
    constructor(dc) {
        this.dc = dc;
    }
    onConnect(io, socket) {
        console.log("[ CONNECT ]: ", socket.id);
        const uid = socket.handshake.query.uid + '';
        this.dc.createUser(uid, socket);
        socket.on(SocketEventEnum_1.SKT_EVT.JOIN_ROOM, (d) => this.joinRoom(socket, d));
        socket.on(SocketEventEnum_1.SKT_EVT.SEND_MESSAGE, (d) => this.sendMessage(io, socket, d));
        socket.on('disconnect', () => this.disconnect(socket));
    }
    joinRoom(socket, data) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("[ JOIN ROOM ]: ", socket.id);
            const isTokenValid = yield this.validateUserToken(data.token, data.uid);
            this.leaveRoomsBySocket(socket, data.uid);
            if (!isTokenValid) {
                socket.emit(SocketEventEnum_1.SKT_EVT.ERROR, SocketEventEnum_1.SKT_EVT.TOKEN_INVALID);
                return;
            }
            if (data.roomIds === undefined || data.roomIds === null) {
                socket.emit(SocketEventEnum_1.SKT_EVT.ERROR, SocketEventEnum_1.SKT_EVT.INVALID_ROOM_ID);
                return;
            }
            data.roomIds.forEach((roomId) => {
                socket.join(roomId);
            });
            console.log("SENDING VALIDATION");
            socket.emit(SocketEventEnum_1.SKT_EVT.JOIN_ROOM_VALIDATE, true);
            return;
        });
    }
    sendMessage(io, socket, data) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("[ SEND MSG ]: ", socket.id);
            try {
                const persistedChat = yield restServiceApi_1.persistChat(data.token, data.newChat);
                if (!io.sockets.adapter.rooms.has(data.roomId)) {
                    socket.emit(SocketEventEnum_1.SKT_EVT.ERROR, SocketEventEnum_1.SKT_EVT.INVALID_ROOM_ID);
                    return;
                }
                const newMessageData = {
                    message: persistedChat,
                    roomId: data.roomId
                };
                io.to(data.roomId).emit(SocketEventEnum_1.SKT_EVT.NEW_MESSAGE, JSON.stringify(newMessageData));
            }
            catch (e) {
                socket.emit(SocketEventEnum_1.SKT_EVT.ERROR, SocketEventEnum_1.SKT_EVT.TOKEN_INVALID);
            }
            return;
        });
    }
    disconnect(socket) {
        console.log("[ DISCONNECT ]: ", socket.id);
        return;
    }
    /*
        Helper methods
    */
    validateUserToken(token, uid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield restServiceApi_1.validateToken(token, uid);
                return res.status;
            }
            catch (e) {
                console.log(e);
                return false;
            }
        });
    }
    leaveRoomsBySocket(socket, uid) {
        var _a;
        // Leave current rooms
        (_a = this.dc.users.get(uid)) === null || _a === void 0 ? void 0 : _a.roomIds.forEach((roomId) => {
            socket.leave(roomId);
        });
    }
}
exports.default = SocketController;
