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
var fetch_ = require("node-fetch");
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
var users = new Map();
var rooms = new Map();
io.on('connection', function (socket) {
    console.log('A new user connected', socket.id);
    var uid = socket.handshake.query.uid;
    var newUser = {
        socketSession: socket,
        uid: uid,
        roomId: null
    };
    users.set(uid, newUser);
    socket.on('join_room', function (data) { return __awaiter(void 0, void 0, void 0, function () {
        var isTokenValid, user, friendshipId, chatsList, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, validateToken(data)];
                case 1:
                    isTokenValid = _a.sent();
                    if (!isTokenValid) return [3 /*break*/, 8];
                    user = users.get(data.uid);
                    if (!(user !== undefined)) return [3 /*break*/, 6];
                    user.roomId = data.roomId;
                    users.set(user.uid, user);
                    // Create room
                    if (!rooms.has(data.roomId)) {
                        rooms.set(data.roomId, new Array());
                    }
                    // Assign user to room
                    rooms.get(data.roomId).push(user.uid);
                    friendshipId = parseInt(data.roomId.substring(1));
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, fetch_(process.env.REST_SERVICE_URL + "/getChatFromFriendship?friendshipId=" + friendshipId, {
                            headers: {
                                'Authorization': 'Bearer ' + data.token
                            }
                        }).then(function (res) { return res.json(); })];
                case 3:
                    chatsList = _a.sent();
                    console.log("=> ", chatsList);
                    socket.emit('message', JSON.stringify({
                        status: 'ok',
                        msg: chatsList
                    }));
                    return [3 /*break*/, 5];
                case 4:
                    e_1 = _a.sent();
                    console.log(e_1);
                    socket.emit('message', JSON.stringify({
                        status: 'error',
                        msg: 'fetch_chats'
                    }));
                    return [3 /*break*/, 5];
                case 5: return [3 /*break*/, 7];
                case 6:
                    socket.emit('message', JSON.stringify({
                        status: 'error',
                        msg: 'uid_invalid'
                    }));
                    _a.label = 7;
                case 7: return [3 /*break*/, 9];
                case 8:
                    socket.emit('message', JSON.stringify({
                        status: 'error',
                        msg: 'token_invalid'
                    }));
                    _a.label = 9;
                case 9: return [2 /*return*/];
            }
        });
    }); });
    socket.on('disconnect', function () {
        console.log("User disconnected", socket.id);
    });
});
function validateToken(data) {
    return __awaiter(this, void 0, void 0, function () {
        var res, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("--> ", data);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, fetch_(process.env.REST_SERVICE_URL + "/validateToken?token=" + data.token + "&uid=" + data.uid).then(function (r) { return r.json(); })];
                case 2:
                    res = _a.sent();
                    console.log("aa>", res);
                    return [2 /*return*/, res.status];
                case 3:
                    e_2 = _a.sent();
                    console.log(e_2);
                    return [2 /*return*/, false];
                case 4: return [2 /*return*/];
            }
        });
    });
}
server.listen(port, function () { return console.log("Listening on port " + port); });
