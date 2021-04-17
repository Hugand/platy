"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataContainer = void 0;
var DataContainer = /** @class */ (function () {
    function DataContainer() {
        this.users = new Map();
    }
    DataContainer.prototype.createUser = function (uid, socket) {
        var newUser = {
            socketSession: socket,
            uid: uid,
            roomIds: []
        };
        this.users.set(uid, newUser);
    };
    return DataContainer;
}());
exports.DataContainer = DataContainer;
