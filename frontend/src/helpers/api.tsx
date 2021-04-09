import { FriendRequest } from "../models/FriendRequest"
import { Friendship } from "../models/Friendship"
import { RecentChat } from "../models/RecentChat"
import { SearchUserResponse } from "../models/SearchUserResponse"
import { User } from "../models/User"
import { UserData } from "../models/UserData"

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

const acceptFriendRequest = (friendRequestId: number, authToken: string): Promise<Object> => {
    return fetch(`${process.env.REACT_APP_API_URL}/acceptFriendRequest?friendRequestId=${friendRequestId}`, {
        headers: {
            'Authorization': 'Bearer ' + authToken
        }
    }).then(res => res.json())
}

const getUserData = (authToken: string): Promise<UserData> => {
    return fetch(`${process.env.REACT_APP_API_URL}/getUserData`, {
        headers: {
            'Authorization': 'Bearer ' + authToken
        }
    }).then(res => res.json())

}

const updateUser = (user: User, file: File, authToken: string): Promise<boolean> => {
    const formData: FormData = new FormData()
    formData.append("file", file);
    formData.append("user", JSON.stringify(user));

    return fetch(`${process.env.REACT_APP_API_URL}/updateUser`, {
        method: "PUT",
        headers: {
            'Authorization': 'Bearer ' + authToken
        },
        body: formData
    }).then(res => res.json())
}

const getFriendsList = (authToken: string): Promise<Array<User>> => {
    return fetch(`${process.env.REACT_APP_API_URL}/getFriendsList`, {
        headers: {
            'Authorization': 'Bearer ' + authToken
        }
    }).then(res => res.json())
}

const logout = (): void => {
    localStorage.removeItem("authToken")
    window.location.href = `/signin`;
}

const getFriendship = (authToken: string, friendId: number): Promise<Friendship> => {
    return fetch(`${process.env.REACT_APP_API_URL}/getFriendship?friendId=${friendId}`, {
        headers: {
            'Authorization': 'Bearer ' + authToken
        }
    }).then(res => res.json())
}

const clearSession = (): void => {
    localStorage.removeItem('authToken')
    window.location.href = `${process.env.REACT_APP_API_URL}/getAuthUser`;
}

const searchFriends = (authToken: string, searchTerm: string): Promise<Array<User>> => {
    return fetch(`${process.env.REACT_APP_API_URL}/searchFriends?searchTerm=${searchTerm}`, {
        headers: {
            'Authorization': 'Bearer ' + authToken
        }
    }).then(res => res.json())
}

const getRecentChatsList = (authToken: string): Promise<Array<RecentChat>> => {
    return fetch(`${process.env.REACT_APP_API_URL}/getLatestChats`, {
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
    getFriendRequestList,
    acceptFriendRequest,
    getUserData,
    updateUser,
    getFriendsList,
    logout,
    clearSession,
    getFriendship,
    searchFriends,
    getRecentChatsList
}