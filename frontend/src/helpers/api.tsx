import { User } from "../components/models/User"

const login = (authToken: string): Promise<User> => {
    return fetch(`${process.env.REACT_APP_API_URL}/getAuthUser`, {
        headers: {
            'Authorization': 'Bearer ' + authToken
        }
    }).then(res => res.json())
}

const searchUsers = (searchTerm: string, authToken: string | null): Promise<Array<User>> => {
    return fetch(`${process.env.REACT_APP_API_URL}/searchUser?searchTerm=${searchTerm}`, {
        headers: {
            'Authorization': 'Bearer ' + authToken
        }
    }).then(res => res.json())
}

const sendFriendRequest = (userToBefriendId: Number, authToken: string): Promise<Map<string, string>> => {
    return fetch(`${process.env.REACT_APP_API_URL}/sendFriendRequest?newFriendId=${userToBefriendId}`, {
        headers: {
            'Authorization': 'Bearer ' + authToken
        }
    }).then(res => res.json())
}

export {
    login,
    searchUsers,
    sendFriendRequest
}