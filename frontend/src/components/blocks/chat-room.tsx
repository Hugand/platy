import { useState } from 'react'
import { useEffect } from 'react'
import { ChatData } from '../../globalState'
import { getFriendship } from '../../helpers/api'
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

    useEffect(() => {
        if(socket !== null) {
            getFriendship(localStorage.getItem('authToken') || '', friend.id)
                .then((friendship: Friendship) => {
                    console.log(friendship)
                    const socketData: any = {
                        token: localStorage.getItem('authToken'),
                        uid: userData.user.uid,
                        roomId: 'F' + friendship.id // Mock value, change this later
                    }

                    setFriendship(friendship)

                    console.log("Emmited", socketData)
                    socket.emit('join_room', socketData)
                })
        }
    }, [friend.id, socket, userData.user.uid])

    const sendMessage = () => {
        if(socket !== null) {
            const previewChat: Chat = new Chat(
                userData.user.id, friendship.id, message, new Date())

            console.log('SENDING', previewChat)

            dispatch({
                type: 'changeChatDataPreviewChat',
                value: previewChat
            })
            socket.emit('send_message', {
                roomId: 'F' + friendship.id,
                newChat: previewChat,
                token: localStorage.getItem('authToken') + ''
            })
            setMessage('')
        }
    }

    return <section className="chat-room-container">
        <header className="friend-header">
            <img src={ `data:image/png;base64, ${ friend.profilePic}` } alt="profile pic"/>
            <label>{ friend.nomeProprio + " " + friend.apelido }</label>
        </header>

        <div className="chat-display-container">
            { chatData.previewChat !== null &&
                <TextMessageBlob
                    isPreview={true}
                    chat={chatData.previewChat} 
                    viewingUser={userData.user} />
            }

            { chatData.chatList.map((chat: Chat) => 
                <TextMessageBlob
                    isPreview={false}
                    key={`${chat.id}-${friend.username}`} 
                    chat={chat} 
                    viewingUser={userData.user} />)
            }
        </div>

        <div className="chat-writer-container">
            <TextField
                classes={'chat-text-field'}
                type={'textarea'}
                placeholder=''
                value={message}
                onInputChange={setMessage}/>
            <button className="btn" onClick={sendMessage}>Send</button>
        </div>
    </section>
}

export default ChatRoom
