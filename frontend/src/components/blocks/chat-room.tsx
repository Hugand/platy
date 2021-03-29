import { useState } from 'react'
import { useEffect } from 'react'
import { ChatData } from '../../globalState'
import { getFriendship } from '../../helpers/api'
import { Chat } from '../../models/Chat'
import { Friendship } from '../../models/Friendship'
import { User } from '../../models/User'
import { useStateValue } from '../../state'
import '../../styles/blocks/chat-room.scss'
import TextMessageBlob from '../atoms/text-message-blob'

type ChatRoomProps = {
    friend: User
    chatData: ChatData
}

function ChatRoom({ friend, chatData }: ChatRoomProps) {
    const [ { socket, userData } ] = useStateValue()
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
            socket.emit('send_message', {
                roomId: 'F' + friendship.id,
                msg: message
            })
        }
    }

    return <section className="chat-room-container">
        <header className="friend-header">
            <img src={ `data:image/png;base64, ${ friend.profilePic}` } alt="profile pic"/>
            <label>{ friend.nomeProprio + " " + friend.apelido }</label>
        </header>

        <div className="chat-display-container">
            { chatData.chatList.map((chat: Chat) => 
                <TextMessageBlob
                    key={`${chat.id}-${friend.username}`} 
                    chat={chat} 
                    viewingUser={userData.user} />)
            }
        </div>

        <div className="chat-writer-container">
            <textarea className="chat-text-field"
                onChange={(e: any) => setMessage(e.target.value)}></textarea>
            <button className="btn" onClick={sendMessage}>Send</button>
        </div>
    </section>
}

export default ChatRoom
