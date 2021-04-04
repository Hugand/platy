"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chat = void 0;
var Chat = /** @class */ (function () {
    function Chat() {
        this.id = 0;
        this.userOrigin = 0;
        this.msg = '';
        this.friendshipId = 0;
        this.timestamp = new Date();
    }
    return Chat;
}());
exports.Chat = Chat;
