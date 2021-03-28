import { useEffect } from 'react'
import { getFriendship } from '../../helpers/api'
import { Friendship } from '../../models/Friendship'
import { useStateValue } from '../../state'
import '../../styles/blocks/chat-room.scss'

function ChatRoom() {
    const [ { socket, userData } ] = useStateValue()

    useEffect(() => {
        if(socket !== null) {
            getFriendship(localStorage.getItem('authToken') || '', 3)
                .then((friendship: Friendship) => {
                    console.log(friendship)
                    const socketData: any = {
                        token: localStorage.getItem('authToken'),
                        uid: userData.user.uid,
                        roomId: 'F8'// + friendship.id // Mock value, change this later
                    }

                    console.log("Emmited", socketData)
                    socket.emit('join_room', socketData)
                })
        }
    }, [socket])

    return <section className="chat-room-container">
        <div className="chat-display-container">

        </div>

        <div className="chat-writer-container">
            <textarea className="chat-text-field"></textarea>
            <button className="btn">Send</button>
        </div>
    </section>
}

export default ChatRoom
