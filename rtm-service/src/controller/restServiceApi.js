"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFriendshipChats = exports.validateToken = void 0;
var _fetch = require("node-fetch");
var validateToken = function (data) {
    return _fetch(process.env.REST_SERVICE_URL + "/validateToken?token=" + data.token + "&uid=" + data.uid)
        .then(function (r) { return r.json(); });
};
exports.validateToken = validateToken;
var getFriendshipChats = function (token, friendshipId) {
    return _fetch(process.env.REST_SERVICE_URL + "/getChatFromFriendship?friendshipId=" + friendshipId, {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    }).then(function (res) { return res.json(); });
};
exports.getFriendshipChats = getFriendshipChats;
