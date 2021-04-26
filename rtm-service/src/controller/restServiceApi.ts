import { Chat } from "../model/Chat";
import { StatusBoolResponse } from "../model/StatusResponse";

// fetch = require("node-fetch");
global.fetch ||= require("node-fetch");

const validateToken = (token: string, uid: string): Promise<StatusBoolResponse> => {
    return fetch(`${process.env.REST_SERVICE_URL}/validateToken?token=${token}&uid=${uid}`)
        .then(res => res.json());
}

const persistChat = (token: string, newChat: Chat): Promise<Chat> => {
    return fetch(`${process.env.REST_SERVICE_URL}/persistChat`, {
        headers: {
            'Authorization': 'Bearer ' + token
        },
        method: 'POST',
        body: JSON.stringify(newChat)
    }).then(res => res.json());
}

export {
    validateToken,
    persistChat
}