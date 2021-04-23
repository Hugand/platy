import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { clearSession } from '@helpers/api';
import { NewMessageData } from '@models/SocketData';
import { useStateValue } from '../state';

function useMessagingWebsocket() {
    const { state, dispatch } = useStateValue();
    const { socket, userData } = state;

    const newMessage = (newMessageStringified: string) => {
        const newMessageData: NewMessageData = JSON.parse(newMessageStringified);
        dispatch({ type: 'addNewChatMessage', value: newMessageData });
        dispatch({
            type: 'changeChatDataPreviewChat',
            value: { previewChat: null, roomId: newMessageData.roomId },
        });
    };

    const errorEvent = (data: string) => {
        console.log('rtm error', data);
        switch (data) {
            case 'token_invalid':
                clearSession();
                break;
            default:
        }
    };

    const createSocket = useRef(() => {});
    createSocket.current = () => {
        const newSocket = io(`${process.env.REACT_APP_WEBSOCKET_URL}`, {
            reconnectionDelayMax: 10000,
            query: {
                uid: userData.user.uid,
            },
        });

        newSocket.on('new_message', newMessage);

        newSocket.on('error', errorEvent);

        dispatch({ type: 'changeSocket', value: newSocket });
    };

    useEffect(() => {
        const socketIsNotCreated = socket === null || socket === undefined;
        if (socketIsNotCreated && userData.user.uid !== '') createSocket.current();
    }, [userData, socket]);

    return socket;
}

export default useMessagingWebsocket;
