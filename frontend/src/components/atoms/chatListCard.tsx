import '@styles/atoms/chat-list-card.scss'
import { RecentChat } from '@models/RecentChat';
import React from 'react';
import { ChatListCardSkeleton } from '@skeletons/chatListCardSkeleton';

interface Props {
    chat: RecentChat
    selectHandler: Function
}

export const ChatListCard: React.FC<Props> = ({ chat, selectHandler }) => {
    return <div className="chat-list-card" onClick={() => selectHandler(chat.friend, chat.friendshipId)}>
        { chat.friend === null
            ? <ChatListCardSkeleton />
            : <>
                <img src={`data:image/png;base64, ${chat.friend.profilePic}`} alt="profile pic"/>
                <article>
                    <h4>{ `${chat.friend.nomeProprio} ${chat.friend.apelido}` }</h4>
                    <p>{ chat.lastMessage.length >= 25 
                        ? chat.lastMessage.substr(0, 25) + '...'
                        : chat.lastMessage }</p>
                </article>
            </> }
    </div>
}

export default ChatListCard