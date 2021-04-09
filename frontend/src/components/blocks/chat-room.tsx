import { useState } from 'react'
import { useEffect } from 'react'
import { clearSession, getFriendship, getFriendshipChats } from '../../helpers/api'
import { Chat } from '../../models/Chat'
import { Friendship } from '../../models/Friendship'
import { User } from '../../models/User'
import { useStateValue } from '../../state'
import '../../styles/blocks/chat-room.scss'
import TextField from '../atoms/text-field'
import TextMessageBlob from '../atoms/text-message-blob'

type ChatRoomProps = {
    friend: User
}

function ChatRoom({ friend }: ChatRoomProps) {
    const [ { socket, userData, chatData }, dispatch ] = useStateValue()
    const [ message, setMessage ] = useState('')
    const [ friendship, setFriendship ]: any = useState(null)

    const makeFriendshipRequest = async () => {
        let friendship: Friendship
        try {
            friendship = await getFriendship(localStorage.getItem('authToken') || '', friend.id)
        } catch (e) {
            clearSession()
            return
        }
        const roomId: string =  'F' + friendship.id

        setFriendship(friendship)
        dispatch({ type: 'changeChatDataCurrRoomId', value: roomId})
    }

    const sendMessage = () => {
        if(socket !== null && message !== '' && message !== null && message !== undefined) {
            const previewChat = new Chat(userData.user.id, friendship.id, message, new Date())

            dispatch({ type: 'changeChatDataPreviewChat', value: previewChat })
            socket.emit('send_message', {
                roomId: chatData.currRoomId,
                newChat: previewChat,
                token: localStorage.getItem('authToken') + ''
            })
            setMessage('')
        }
    }

    useEffect(() => {
        if(socket !== null) {
            makeFriendshipRequest()

            socket.emit('join_room', {
                token: localStorage.getItem('authToken') || '',
                uid: userData.user.uid,
                roomId: chatData.currRoomId
            })
        }

    }, [friend.id, socket, userData.user.uid])


    return <section className="chat-room-container">
        <header className="friend-header">
            <img src={ `data:image/png;base64, ${ friend.profilePic}` } alt="profile pic"/>
            <label>{ friend.nomeProprio + " " + friend.apelido }</label>
        </header>

        <div className="chat-display-container">
            { (chatData.chatRooms.get(chatData.currRoomId) !== undefined && chatData.chatRooms.get(chatData.currRoomId)?.previewChat !== null) &&
                <TextMessageBlob
                    isPreview={true}
                    chat={chatData.chatRooms.get(chatData.currRoomId)?.previewChat} 
                    viewingUser={userData.user} /> }

            { chatData.chatRooms.get(chatData.currRoomId)?.chatsList.map((chat: Chat) => 
                <TextMessageBlob
                    isPreview={false}
                    key={`${chat.id}-${friend.username}`} 
                    chat={chat} 
                    viewingUser={userData.user} />) }
        </div>

        <div className="chat-writer-container">
            <div className="input-container">
                <TextField
                    classes={'no-borders white-bg giant-borders'}
                    placeholder=''
                    value={message}
                    onInputChange={setMessage}/>
                <button className="btn btn-secondary" onClick={sendMessage}>Send</button>
            </div>
        </div>
    </section>
}

export default ChatRoom
