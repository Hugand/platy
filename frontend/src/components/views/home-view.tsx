import { useState, useEffect } from 'react'
import { RecentChatsBar } from '..'
import { User } from '../../models/User'
import { useStateValue } from '../../state'
import '../../styles/views/home.scss'
import ChatRoom from '../blocks/chat-room'

function HomeView() {
    const [ userToChat, setUserToChat ]: any = useState(null)
    const [ { chatData } ] = useStateValue()

    return <section className="home-view-container">
        <RecentChatsBar />

        <section className="place">
            { chatData.userToChat === null 
                ? <p>Choose a chat</p> 
                : <ChatRoom 
                    chatData={chatData}
                    friend={chatData.userToChat}/>
            }
        </section>

    </section>
}

export default HomeView