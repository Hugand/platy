import React, { useState, useEffect, useRef } from 'react';
import { clearSession, getFriendship, getFriendshipChats } from '@helpers/api';
import { useScreenType } from '@hooks/useScreenType';
import { Chat } from '@models/Chat';
import { Friendship } from '@models/Friendship';
import { User } from '@models/User';
import { useStateValue } from '../../state';
import '@styles/blocks/chat-room.scss';
import TextField from '@atoms/textField';
import TextMessageBlob from '@atoms/textMessageBlob';
import backIcon from '@assets/img/back_icon.svg';
import { ChatLoadingSkeleton } from '@skeletons/chatLoadingSkeleton';

interface Props {
    friend: User;
    setIsInRoom: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ChatRoom: React.FC<Props> = ({ friend, setIsInRoom }) => {
    const {
        state: { socket, userData, chatData, chatRooms },
        dispatch,
    } = useStateValue();
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const screenType = useScreenType();

    const getFriendshipData = async () => {
        try {
            const friendship: Friendship = await getFriendship(localStorage.getItem('authToken') || '', friend.id);
            const roomId: string = 'F' + friendship.id;

            dispatch({ type: 'changeChatDataCurrRoomId', value: roomId });

            if (chatRooms.get(roomId) === undefined) dispatch({ type: 'createChatRoom', value: roomId });
        } catch (e) {
            clearSession();
        }
    };

    const getMessages = async () => {
        try {
            const friendshipId: number = parseInt(chatData.currRoomId.substring(1));
            const res = await getFriendshipChats(localStorage.getItem('authToken') || '', friendshipId);
            dispatch({ type: 'changeChatDataList', value: res });
        } catch (e) {
            clearSession();
        }
    };

    const fetchChatRoomData = useRef(() => {});
    fetchChatRoomData.current = async () => {
        if (socket !== null) {
            if (chatRooms.get(chatData.currRoomId) === undefined) setIsLoading(true);

            if (chatData.currRoomId === '') await getFriendshipData();

            await getMessages();

            setIsLoading(false);
        }
    };

    const sendMessage = () => {
        if (socket !== null && message !== null && message !== undefined && message.trim() !== '') {
            const friendshipId: number = parseInt(chatData.currRoomId.substring(1));
            const previewChat = new Chat(userData.user.id, friendshipId, message.trim(), new Date());

            dispatch({
                type: 'changeChatDataPreviewChat',
                value: { roomId: chatData.currRoomId, previewChat },
            });
            socket.emit('send_message', {
                roomId: chatData.currRoomId,
                newChat: previewChat,
                token: localStorage.getItem('authToken') || '',
            });
            setMessage('');
        }
    };

    useEffect(() => {
        fetchChatRoomData.current();
    }, [friend.id, socket, userData.user.uid, chatData.currRoomId]);

    return (
        <section className="chat-room-container">
            <header className="friend-header">
                {screenType === 'mobile' && (
                    <button className="btn btn-secondary" onClick={() => setIsInRoom(false)}>
                        <img src={backIcon} alt="back_icn" />
                    </button>
                )}
                <img src={`data:image/png;base64, ${friend.profilePic}`} alt="profile pic" />
                <label>{friend.nomeProprio + ' ' + friend.apelido}</label>
            </header>

            {chatData.currRoomId !== '' && chatData.currRoomId !== 'F-1' && (
                <div className="chat-display-container">
                    {isLoading ? (
                        <>
                            {' '}
                            <ChatLoadingSkeleton />{' '}
                        </>
                    ) : (
                        <>
                            {chatRooms.get(chatData.currRoomId) !== undefined &&
                                chatRooms.get(chatData.currRoomId)?.previewChat !== null && (
                                    <TextMessageBlob
                                        isPreview={true}
                                        chat={chatRooms.get(chatData.currRoomId)?.previewChat as Chat}
                                        viewingUser={userData.user}
                                    />
                                )}

                            {chatRooms.get(chatData.currRoomId) !== undefined &&
                                chatRooms
                                    .get(chatData.currRoomId)
                                    ?.chatsList.map((chat: Chat) => (
                                        <TextMessageBlob
                                            isPreview={false}
                                            key={`${chat.id}-${friend.username}`}
                                            chat={chat}
                                            viewingUser={userData.user}
                                        />
                                    ))}
                        </>
                    )}
                </div>
            )}

            <div className="chat-writer-container">
                <div className="input-container">
                    <TextField
                        classes={'no-borders white-bg giant-borders'}
                        placeholder=""
                        value={message}
                        onInputChange={setMessage}
                    />
                    <button className="btn btn-secondary" onClick={sendMessage} disabled={message.trim() === ''}>
                        Send
                    </button>
                </div>
            </div>
        </section>
    );
};
