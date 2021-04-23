import { useState, useEffect, useRef } from 'react';
import { RecentChatsBar } from '@blocks/recentChatsBar';
import { useStateValue } from '../../state';
import '@styles/views/home.scss';
import { useScreenType } from '@hooks/useScreenType';
import { clearSession, getFriendsIdsList } from '@helpers/api';
import { ChatRoom } from '@blocks/chatRoom';

export const HomeView: React.FC = () => {
    const { state, dispatch } = useStateValue();
    const { chatData, socket, userData } = state;
    const screenType = useScreenType();
    const [isInRoom, setIsInRoom] = useState(false);

    const joinRooms = (friendsIds: Array<number>) => {
        if (socket !== null)
            socket.emit('join_room', {
                token: localStorage.getItem('authToken') || '',
                uid: userData.user.uid,
                roomIds: friendsIds.map((id: number) => 'F' + id),
            });
    };

    const fetchFriendsIds = useRef(() => {});
    fetchFriendsIds.current = async () => {
        try {
            const res: Array<number> = await getFriendsIdsList(localStorage.getItem('authToken') || '');
            dispatch({ type: 'changeFriendsIds', value: res });
            joinRooms(res);
            return res;
        } catch (e) {
            clearSession();
        }
    };

    useEffect(() => {
        if (socket !== null) fetchFriendsIds.current();
    }, [socket]);

    if (screenType === 'mobile')
        return (
            <section className="home-view-container">
                {!isInRoom ? (
                    <RecentChatsBar setIsInRoom={setIsInRoom} />
                ) : (
                    <section className="place">
                        {chatData.userToChat === null ? (
                            <p>Choose a chat</p>
                        ) : (
                            <ChatRoom setIsInRoom={setIsInRoom} friend={chatData.userToChat} />
                        )}
                    </section>
                )}
            </section>
        );
    else
        return (
            <section className="home-view-container">
                <RecentChatsBar setIsInRoom={setIsInRoom} />

                <section className="place">
                    {chatData.userToChat === null ? (
                        <p>Choose a chat</p>
                    ) : (
                        <ChatRoom setIsInRoom={setIsInRoom} friend={chatData.userToChat} />
                    )}
                </section>
            </section>
        );
};
