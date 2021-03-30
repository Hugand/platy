import { useEffect } from 'react'
import "../../styles/views/main.scss"
import { NavBar } from '..'
import { useStateValue } from '../../state';
import { GlobalStateAction } from '../../globalState';
import { io } from 'socket.io-client';
import { clearSession, getUserData } from '../../helpers/api';
import { UserData } from '../../models/UserData';
import { Chat } from '../../models/Chat';
import useMessagingWebsocket from '../../hooks/useMessagingWebsocket';

function MainView({ contentComponent }: any) {
    const [, dispatch ] = useStateValue()
    const socket = useMessagingWebsocket();

    useEffect(() => {
        async function fetchUserData(): Promise<void> {
            try {
                let userData: UserData = await getUserData(localStorage.getItem('authToken') || '')
                dispatch({ type: 'changeUser', value: userData })
                console.log(userData)
            } catch(e) {
                clearSession()
            }
        }
        
        fetchUserData()

        return () => {
            socket.disconnect()
        }
    }, [])
    
    return <main>
        <NavBar />
        <section className="content">
            { contentComponent }
        </section>
    </main>
}

export default MainView