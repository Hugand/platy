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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var restServiceApi_1 = require("./restServiceApi");
var SocketController = /** @class */ (function () {
    function SocketController(dc) {
        this.dc = dc;
    }
    SocketController.prototype.joinRoom = function (socket, data) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var isTokenValid;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        console.log("[ JOIN ROOM ]: ", socket.id);
                        console.log(data);
                        return [4 /*yield*/, this.validateUserToken(data)];
                    case 1:
                        isTokenValid = _b.sent();
                        console.log(isTokenValid);
                        if (!isTokenValid) {
                            socket.emit('error', 'token_invalid');
                            return [2 /*return*/];
                        }
                        if (data.roomIds === undefined || data.roomIds === null) {
                            socket.emit('error', 'wrong_room_id');
                            return [2 /*return*/];
                        }
                        // Assign user to room
                        // if(this.dc.users.get(data.uid)!.roomIds !== null)
                        //     socket.leave(this.dc.users.get(data.uid)!.roomId)
                        // Leave current rooms
                        (_a = this.dc.users.get(data.uid)) === null || _a === void 0 ? void 0 : _a.roomIds.forEach(function (roomId) {
                            socket.leave(roomId);
                        });
                        // socket.join(data.roomIds)
                        data.roomIds.forEach(function (roomId) {
                            socket.join(roomId);
                            console.log("JOINING ROOM", roomId);
                            // Get friendship chats
                            // let friendshipId: number = parseInt(data.roomIds.substring(1))
                            // let chatsList: Array<Chat>;
                            // try {
                            //     chatsList = await getFriendshipChats(data.token, friendshipId);
                            // } catch (e) {
                            //     socket.emit('error', 'fetch_chats')
                            //     return
                            // }
                        });
                        console.log(socket.rooms);
                        return [2 /*return*/];
                }
            });
        });
    };
    // TODO: Might still need a little bit more work on error handling
    SocketController.prototype.sendMessage = function (io, socket, data) {
        return __awaiter(this, void 0, void 0, function () {
            var persistedChat, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("[ SEND MSG ]: ", socket.id);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, restServiceApi_1.persistChat(data.token, data.newChat)
                            // console.log(io.sockets.clients(data.roomId))
                        ];
                    case 2:
                        persistedChat = _a.sent();
                        // console.log(io.sockets.clients(data.roomId))
                        io.to(data.roomId).emit('new_message', JSON.stringify({ message: persistedChat, roomId: data.roomId }));
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _a.sent();
                        socket.emit('error', 'token_invalid');
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    SocketController.prototype.disconnect = function (socket) {
        console.log("[ DISCONNECT ]: ", socket.id);
        // socket.rooms.forEach((room: any) => {
        //     console.log("DISCONNECTING FROM", room)
        //     socket.leave(room)
        // });
        // this.dc.users.get(data.uid)?.roomIds.forEach((roomId: string) => {
        //     socket.leave(roomId)
        // })
    };
    /*
        Helper methods
    */
    SocketController.prototype.validateUserToken = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var res, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, restServiceApi_1.validateToken(data)];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, res.status];
                    case 2:
                        e_2 = _a.sent();
                        console.log(e_2);
                        return [2 /*return*/, false];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return SocketController;
}());
exports.default = SocketController;
