import { useEffect } from 'react'
import { io } from "socket.io-client";
import { Chat } from '../models/Chat';
import { useStateValue } from '../state';


function useMessagingWebsocket() {
    const [ { socket, userData }, dispatch ] = useStateValue()

    useEffect(() => {
        if((socket === null || socket === undefined || !socket.connected) && userData.user.uid !== '') {
            console.log(userData)
            const newSocket = io(`${process.env.REACT_APP_WEBSOCKET_URL}`, {
                reconnectionDelayMax: 10000,
                query: {
                    uid: userData.user.uid,
                }
            })
    
            newSocket.on('chat_data', (data: string) => {
                console.log("rtm ok", data)
                dispatch({
                    type: 'changeChatDataList',
                    value: JSON.parse(data)
                })
            })
    
            newSocket.on('new_message', (newMessageStringified: string) => {
                const newMessage: Chat = JSON.parse(newMessageStringified)
                console.log("rtm msg", newMessage)
                dispatch({ type: 'addNewChatMessage', value: newMessage })
                dispatch({ type: 'changeChatDataPreviewChat', value: null })
            })
    
            newSocket.on('error', (data: any) => {
                console.log("rtm error", data)
            })
    
            dispatch({ type: 'changeSocket', value: newSocket })
        }
    }, [userData])


    return socket
}

export default useMessagingWebsocket