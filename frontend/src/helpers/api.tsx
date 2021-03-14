import { FriendRequest } from "../components/models/FriendRequest"
import { SearchUserResponse } from "../components/models/SearchUserResponse"
import { User } from "../components/models/User"

const login = (authToken: string): Promise<User> => {
    return fetch(`${process.env.REACT_APP_API_URL}/getAuthUser`, {
        headers: {
            'Authorization': 'Bearer ' + authToken
        }
    }).then(res => res.json())
}

const searchUsers = (searchTerm: string, authToken: string | null): Promise<SearchUserResponse> => {
    return fetch(`${process.env.REACT_APP_API_URL}/searchUser?searchTerm=${searchTerm}`, {
        headers: {
            'Authorization': 'Bearer ' + authToken
        }
    }).then(res => res.json())
}

const sendFriendRequest = (userToBefriendId: Number, authToken: string): Promise<Object> => {
    return fetch(`${process.env.REACT_APP_API_URL}/sendFriendRequest?newFriendId=${userToBefriendId}`, {
        headers: {
            'Authorization': 'Bearer ' + authToken
        }
    }).then(res => res.json())
}

const cancelFriendRequest = (destinyUserId: Number, authToken: string): Promise<Object> => {
    return fetch(`${process.env.REACT_APP_API_URL}/cancelFriendRequest?destinyUserId=${destinyUserId}`, {
        headers: {
            'Authorization': 'Bearer ' + authToken
        }
    }).then(res => res.json())
}

const getFriendRequestList = (authToken: string): Promise<Array<FriendRequest>> => {
    return fetch(`${process.env.REACT_APP_API_URL}/getFriendRequests`, {
        headers: {
            'Authorization': 'Bearer ' + authToken
        }
    }).then(res => res.json())
}

export {
    login,
    searchUsers,
    sendFriendRequest,
    cancelFriendRequest,
    getFriendRequestList
}