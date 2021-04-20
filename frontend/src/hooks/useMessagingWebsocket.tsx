import { useEffect } from 'react'
import { io } from "socket.io-client";
import { clearSession } from '@helpers/api';
import { NewMessageData } from '@models/SocketData';
import { useStateValue } from '../state';


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
            
            newSocket.on('new_message', (newMessageStringified: string) => {
                const newMessageData: NewMessageData = JSON.parse(newMessageStringified)
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