"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.persistChat = exports.getFriendshipChats = exports.validateToken = void 0;
var _fetch = require("node-fetch");
var validateToken = function (data) {
    return _fetch(process.env.REST_SERVICE_URL + "/validateToken?token=" + data.token + "&uid=" + data.uid)
        .then(function (r) { return r.json(); });
};
exports.validateToken = validateToken;
var getFriendshipChats = function (token, friendshipId) {
    return _fetch(process.env.REST_SERVICE_URL + "/getChatsFromFriendship?friendshipId=" + friendshipId, {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    }).then(function (res) { return res.json(); });
};
exports.getFriendshipChats = getFriendshipChats;
var persistChat = function (token, newChat) {
    return _fetch(process.env.REST_SERVICE_URL + "/persistChat", {
        headers: {
            'Authorization': 'Bearer ' + token
        },
        method: 'POST',
        body: JSON.stringify(newChat)
    }).then(function (res) { return res.json(); });
};
exports.persistChat = persistChat;
