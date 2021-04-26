"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.persistChat = exports.validateToken = void 0;
// fetch = require("node-fetch");
global.fetch || (global.fetch = require("node-fetch"));
const validateToken = (token, uid) => {
    return fetch(`${process.env.REST_SERVICE_URL}/validateToken?token=${token}&uid=${uid}`)
        .then(res => res.json());
};
exports.validateToken = validateToken;
const persistChat = (token, newChat) => {
    return fetch(`${process.env.REST_SERVICE_URL}/persistChat`, {
        headers: {
            'Authorization': 'Bearer ' + token
        },
        method: 'POST',
        body: JSON.stringify(newChat)
    }).then(res => res.json());
};
exports.persistChat = persistChat;
