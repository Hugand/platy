import { useState, useEffect } from 'react'
import { RecentChatsBar } from '..'
import '../../styles/views/home.scss'
import ChatRoom from '../blocks/chat-room'

function HomeView() {
    return <section className="home-view-container">
        <RecentChatsBar />

        <section className="place">
            {/* <p>Choose a chat</p> */}
            <ChatRoom />
        </section>

    </section>
}

export default HomeView