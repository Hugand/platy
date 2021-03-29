import { useState, useEffect } from 'react'
import { RecentChatsBar } from '..'
import { User } from '../../models/User'
import '../../styles/views/home.scss'
import ChatRoom from '../blocks/chat-room'

function HomeView() {
    const [ userToChat, setUserToChat ]: any = useState(null)

    return <section className="home-view-container">
        <RecentChatsBar setUserToChat={setUserToChat}/>

        <section className="place">
            { userToChat === null 
                ? <p>Choose a chat</p> 
                : <ChatRoom friend={userToChat}/>
            }
        </section>

    </section>
}

export default HomeView