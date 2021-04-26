"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataContainer = void 0;
class DataContainer {
    constructor() {
        this.users = new Map();
    }
    createUser(uid, socket) {
        const newUser = {
            socketSession: socket,
            uid,
            roomIds: []
        };
        this.users.set(uid, newUser);
    }
}
exports.DataContainer = DataContainer;
