"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataContainer = void 0;
var Room_1 = require("./Room");
var DataContainer = /** @class */ (function () {
    function DataContainer() {
        this.rooms = new Map();
        this.users = new Map();
    }
    DataContainer.prototype.broadcastToRoom = function (event, msg, roomId) {
        this.rooms.get(roomId).broadcast(event, msg, this.users);
    };
    DataContainer.prototype.createRoom = function (roomId) {
        if (!this.rooms.has(roomId))
            this.rooms.set(roomId, new Room_1.Room);
    };
    DataContainer.prototype.createUser = function (uid, socket) {
        var newUser = {
            socketSession: socket,
            uid: uid,
            roomId: null
        };
        this.users.set(uid, newUser);
    };
    return DataContainer;
}());
exports.DataContainer = DataContainer;
