import { useState, useEffect } from 'react'
import { RecentChatsBar } from '..'
import '../../styles/views/home.scss'

function HomeView() {
    return <section className="home-view-container">
        <RecentChatsBar />

        <section className="place">
            <p>Choose a chat</p>
        </section>

    </section>
}

export default HomeView