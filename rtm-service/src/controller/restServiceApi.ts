const _fetch = require("node-fetch");

const validateToken = (data: any) => {
    return _fetch(`${process.env.REST_SERVICE_URL}/validateToken?token=${data.token}&uid=${data.uid}`)
        .then((r: any) => r.json())
}

const getFriendshipChats = (token: string, friendshipId: number) => {
    return _fetch(`${process.env.REST_SERVICE_URL}/getChatFromFriendship?friendshipId=${friendshipId}`, {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    }).then((res: any) => res.json())
}

export {
    validateToken,
    getFriendshipChats
}