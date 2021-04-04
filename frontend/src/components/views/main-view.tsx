import { useEffect } from 'react'
import { NavBar } from '..'
import { useStateValue } from '../../state';
import { clearSession, getUserData } from '../../helpers/api';
import { UserData } from '../../models/UserData';
import useMessagingWebsocket from '../../hooks/useMessagingWebsocket';
import "../../styles/views/main.scss"

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