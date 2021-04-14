import { useState, useEffect } from 'react'
import '../../styles/blocks/recent-chats-bar.scss'
import { TextField, ChatListCard } from '..'
import Modal from 'react-modal';
import SearchUserToChatModal from './search-user-to-chat-modal';
import { User } from '../../models/User';
import { useStateValue } from '../../state';
import { getRecentChatsList, clearSession } from '../../helpers/api';
import { RecentChat } from '../../models/RecentChat';

function RecentChatsBar() {
    const [ searchTerm, setSearchTerm ] = useState('')
    const [ isModalOpen, setIsModalOpen ] = useState(false)
    const [ { recentChatsList, chatData } , dispatch ] = useStateValue()

    const setUserToChat = (user: User) => {
        dispatch({ type: 'changeChatDataUser2Chat', value: user })
    }
    
    const selectUserHandler = (user: User, friendshipId: number = -1) => {
        const roomId: string = 'F' + friendshipId
      
        
        if (chatData.userToChat === null || (user !== null && user.id !== chatData.userToChat.id)) {
            setUserToChat(user)
            if(friendshipId !== -1) {
                dispatch({ type: 'changeChatDataCurrRoomId', value: roomId})
            }
        }

        setIsModalOpen(false)
    }

    const fetchRecentChats = async () => {
        const authToken: string = localStorage.getItem('authToken') + ''
        try {
            const res: Array<RecentChat> = await getRecentChatsList(authToken)
            dispatch({ type: 'changeRecentChatsList', value: res})
        } catch(e) {
            clearSession()
        }
    }

    useEffect(() => {
        fetchRecentChats()
    }, [])

    return <section className="chats-bar-container">
        <div className="bar-header">
            <div>
                <TextField placeholder="Search" value={ searchTerm } onInputChange={setSearchTerm}/>
                <button className="btn" onClick={() => setIsModalOpen(true)}>+</button>
            </div>
        </div>

        <div className="chat-list">
            { recentChatsList.length === 0
                ? <p>No recent chats. Start a conversation with a friend!</p>
                : recentChatsList.map((recentChat: RecentChat) => 
                    <ChatListCard
                        key={recentChat.friendshipId}
                        chat={recentChat}
                        selectHandler={selectUserHandler} />) }
        </div>

        <Modal
            isOpen={isModalOpen}
            onRequestClose={() => setIsModalOpen(false)}
            ariaHideApp={false}>
            <SearchUserToChatModal selectUser={selectUserHandler} />
        </Modal>
    </section>
}

export default RecentChatsBar