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
        return __awaiter(this, void 0, void 0, function () {
            var isTokenValid, friendshipId, chatsList, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.validateUserToken(data)];
                    case 1:
                        isTokenValid = _a.sent();
                        if (!isTokenValid) {
                            socket.emit('error', 'token_invalid');
                            return [2 /*return*/];
                        }
                        // Assign user to room
                        if (this.dc.users.get(data.uid).roomId !== null)
                            socket.leave(this.dc.users.get(data.uid).roomId);
                        socket.join(data.roomId);
                        friendshipId = parseInt(data.roomId.substring(1));
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, restServiceApi_1.getFriendshipChats(data.token, friendshipId)];
                    case 3:
                        chatsList = _a.sent();
                        socket.emit('chat_data', JSON.stringify(chatsList));
                        return [3 /*break*/, 5];
                    case 4:
                        e_1 = _a.sent();
                        socket.emit('error', 'fetch_chats');
                        return [3 /*break*/, 5];
                    case 5:
                        console.log("->", this.dc.rooms);
                        return [2 /*return*/];
                }
            });
        });
    };
    SocketController.prototype.sendMessage = function (socket, data) {
        socket.to(data.roomId).emit('msg', data.msg);
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
                        return [2 /*return*/, false];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return SocketController;
}());
exports.default = SocketController;
