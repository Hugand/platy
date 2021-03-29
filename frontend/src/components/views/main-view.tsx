import { useEffect } from 'react'
import "../../styles/views/main.scss"
import { NavBar } from '..'
import { useStateValue } from '../../state';
import { GlobalStateAction } from '../../globalState';
import { io } from 'socket.io-client';
import { clearSession, getUserData } from '../../helpers/api';
import { UserData } from '../../models/UserData';

function MainView({ contentComponent }: any) {
    const [ { socket }, dispatch ] = useStateValue()

    useEffect(() => {
        console.log(socket)
        let userData: UserData;

        function initializeSocket(): void {
            console.log(userData)
            if(socket === null || socket === undefined || !socket.connected) {
                console.log(userData)
                const newSocket = io(`${process.env.REACT_APP_WEBSOCKET_URL}`, {
                    reconnectionDelayMax: 10000,
                    query: {
                        uid: userData.user.uid,
                    }
                })

                newSocket.on('chat_data', (data: any) => {
                    console.log("rtm ok", data)
                })

                newSocket.on('msg', (data: any) => {
                    console.log("rtm msg", data)
                })

                newSocket.on('error', (data: any) => {
                    console.log("rtm error", data)
                })

                const dispatchData: GlobalStateAction = {
                    type: 'changeSocket',
                    value: newSocket
                }
        
                dispatch(dispatchData)
            }
        }

        async function fetchUserData(): Promise<void> {
            try {
                userData = await getUserData(localStorage.getItem('authToken') || '')
                console.log(userData)
                dispatch({
                    type: 'changeUser',
                    value: userData
                })

                initializeSocket()
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