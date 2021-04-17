import { useEffect } from 'react'
import { io } from "socket.io-client";
import { clearSession } from '../helpers/api';
import { Chat } from '../models/Chat';
import { useStateValue } from '../state';

type NewMessageData = {
    message: Chat
    roomId: string
}

function useMessagingWebsocket() {
    const [ { socket, userData, chatData }, dispatch ] = useStateValue()

    useEffect(() => {
        if((socket === null || socket === undefined) && userData.user.uid !== '') {
            const newSocket = io(`${process.env.REACT_APP_WEBSOCKET_URL}`, {
                reconnectionDelayMax: 10000,
                query: {
                    uid: userData.user.uid,
                }
            })
            // console.log(socket, newSocket)
    
            newSocket.on('chat_data', (data: string) => {
                console.log("rtm ok", data)
                const parsedData = JSON.parse(data)
                if(chatData.currRoomId === parsedData.roomId)
                    dispatch({
                        type: 'changeChatDataList',
                        value: parsedData.chatsList
                    })
            })
    
            newSocket.on('new_message', (newMessageStringified: string) => {
                console.log("rtm msg str", newMessageStringified)
                const newMessageData: NewMessageData = JSON.parse(newMessageStringified)
                console.log("rtm msg", newMessageData)
                dispatch({ type: 'addNewChatMessage', value: newMessageData })
                dispatch({ type: 'changeChatDataPreviewChat', value: { previewChat: null, roomId: newMessageData.roomId } })
            })
    
            newSocket.on('error', (data: string) => {
                console.log("rtm error", data)
                switch(data) {
                    case 'token_invalid':
                        clearSession()
                        break
                    default:
                }
            })
    
            dispatch({ type: 'changeSocket', value: newSocket })
        }
    }, [userData])


    return socket
}

export default useMessagingWebsocket