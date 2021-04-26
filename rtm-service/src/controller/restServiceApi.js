"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.persistChat = exports.getFriendshipChats = exports.validateToken = void 0;
// fetch = require("node-fetch");
global.fetch || (global.fetch = require("node-fetch"));
const validateToken = (data) => {
    return fetch(`${process.env.REST_SERVICE_URL}/validateToken?token=${data.token}&uid=${data.uid}`)
        .then((r) => r.json());
};
exports.validateToken = validateToken;
const getFriendshipChats = (token, friendshipId) => {
    return fetch(`${process.env.REST_SERVICE_URL}/getChatsFromFriendship?friendshipId=${friendshipId}`, {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    }).then((res) => res.json());
};
exports.getFriendshipChats = getFriendshipChats;
const persistChat = (token, newChat) => {
    return fetch(`${process.env.REST_SERVICE_URL}/persistChat`, {
        headers: {
            'Authorization': 'Bearer ' + token
        },
        method: 'POST',
        body: JSON.stringify(newChat)
    }).then((res) => res.json());
};
exports.persistChat = persistChat;
