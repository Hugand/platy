import { useState, useEffect, useRef } from 'react';
import '@styles/blocks/recent-chats-bar.scss';
import { TextField } from '@atoms/textField';
import { ChatListCard } from '@atoms/chatListCard';
import Modal from 'react-modal';
import { SearchUserToChatModal } from '@blocks/searchUserToChatModal';
import { User } from '@models/User';
import { useStateValue } from '../../state';
import { getRecentChatsList, clearSession, getFriendFromFriendship } from '@helpers/api';
import { RecentChat } from '@models/RecentChat';

interface Props {
    setIsInRoom: React.Dispatch<React.SetStateAction<boolean>>;
}

export const RecentChatsBar: React.FC<Props> = ({ setIsInRoom }) => {
    const { state, dispatch } = useStateValue();
    const { recentChatsList, chatData } = state;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const setUserToChat = (user: User) => {
        dispatch({ type: 'changeChatDataUser2Chat', value: user });
    };

    const selectUserHandler = (user: User, friendshipId = -1) => {
        const roomId: string = 'F' + friendshipId;

        if (chatData.userToChat === null || (user !== null && user.id !== chatData.userToChat.id)) {
            setUserToChat(user);
            if (friendshipId !== -1) dispatch({ type: 'changeChatDataCurrRoomId', value: roomId });
        }

        setIsInRoom(true);
        setIsModalOpen(false);
    };

    const fetchRecentChats = useRef(() => {});
    fetchRecentChats.current = async () => {
        const authToken: string = localStorage.getItem('authToken') || '';
        try {
            const res: Array<RecentChat> = await getRecentChatsList(authToken);
            dispatch({ type: 'changeRecentChatsList', value: res });
        } catch (e) {
            clearSession();
        }
    };

    const getFriend = async (chat: RecentChat) => {
        try {
            const chatCpy = { ...chat };
            const friend = await getFriendFromFriendship(localStorage.getItem('authToken') || '', chatCpy.friendshipId);
            chatCpy.friend = friend;
            dispatch({
                type: 'changeRecentChatItem',
                value: {
                    friendshipId: chatCpy.friendshipId,
                    recentChatItem: chatCpy,
                },
            });
        } catch (e) {
            clearSession();
        }
    };

    useEffect(() => {
        fetchRecentChats.current();
    }, []);

    return (
        <section className="chats-bar-container">
            <div className="bar-header">
                <div>
                    <TextField placeholder="Search" value={searchTerm} onInputChange={setSearchTerm} />
                    <button className="btn" onClick={() => setIsModalOpen(true)}>
                        +
                    </button>
                </div>
            </div>

            <div className="chat-list">
                {recentChatsList.length === 0 ? (
                    <p>No recent chats. Start a conversation with a friend!</p>
                ) : (
                    recentChatsList.map((recentChat: RecentChat) => {
                        if (recentChat.friend === null) getFriend(recentChat);

                        return (
                            <ChatListCard
                                key={recentChat.friendshipId}
                                chat={recentChat}
                                selectHandler={selectUserHandler}
                            />
                        );
                    })
                )}
            </div>

            <Modal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)} ariaHideApp={false}>
                <SearchUserToChatModal selectUser={selectUserHandler} />
            </Modal>
        </section>
    );
};
