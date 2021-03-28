"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Room = void 0;
var Room = /** @class */ (function () {
    function Room() {
        this.users = new Set();
    }
    Room.prototype.broadcast = function (event, msg, usersList) {
        this.users.forEach(function (user) {
            var _a;
            (_a = usersList.get(user)) === null || _a === void 0 ? void 0 : _a.socketSession.emit(event, msg);
        });
    };
    Room.prototype.addUser = function (user) {
        this.users.add(user);
    };
    return Room;
}());
exports.Room = Room;
