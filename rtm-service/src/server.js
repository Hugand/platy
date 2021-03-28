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
    // Users without a room
    // socket.join('F8')
    var uid = socket.handshake.query.uid + '';
    dataContainer.createUser(uid, socket);
    socket.on('join_room', function (d) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("sr", socket.rooms);
                    console.log(d);
                    return [4 /*yield*/, socketController.joinRoom(socket, d)];
                case 1:
                    _a.sent();
                    console.log("sr2", socket.rooms);
                    io.in('F8').emit('chat_data', "ddddd");
                    return [2 /*return*/];
            }
        });
    }); });
    socket.on('disconnect', function () {
        console.log("User disconnected", socket.id);
    });
});
server.listen(port, function () { return console.log("Listening on port " + port); });
