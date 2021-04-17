import '../../styles/atoms/chat-list-card.scss'
import { RecentChat } from '../../models/RecentChat';
import { useEffect } from 'react';
import { getFriendFromFriendship } from '../../helpers/api';
import { User } from '../../models/User';
import Skeleton from 'react-loading-skeleton';
import { useStateValue } from '../../state';

type ChatListCardProps = {
    chat: RecentChat
    selectHandler: Function
}

function ChatListCard({ chat, selectHandler }: ChatListCardProps) {
    const [, dispatch ] = useStateValue()

    useEffect(() => {
        if(chat.friend === null)
            getFriendFromFriendship(localStorage.getItem('authToken') || '', chat.friendshipId)
                .then((friend: User) => {
                    chat.friend = friend
                    dispatch({
                        type: 'changeRecentChatItem',
                        value: {
                            friendshipId: chat.friendshipId,
                            recentChatItem: chat
                        }
                    })
                })
    }, [chat.friend])

    return <div className="chat-list-card" onClick={() => selectHandler(chat.friend, chat.friendshipId)}>
        { chat.friend === null ? 
            <>
                <Skeleton width={80} height={80} circle={true} style={{ marginTop: 8, marginBottom: 8, float: 'right' }} />
                <article>
                    <h4><Skeleton width={'100%'} height={30}/></h4>
                    <p><Skeleton width={'60%'} height={16}/></p>
                </article>
            </>
            : 
            <>
                <img src={`data:image/png;base64, ${chat.friend.profilePic}`} alt="profile pic"/>
                <article>
                    <h4>{ `${chat.friend.nomeProprio} ${chat.friend.apelido}` }</h4>
                    <p>{ chat.lastMessage.length >= 25 
                        ? chat.lastMessage.substr(0, 25) + '...'
                        : chat.lastMessage }</p>
                </article>
            </>
        }
    </div>
}

export default ChatListCard