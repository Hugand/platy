import { useEffect } from 'react'
import { NavBar } from '@blocks/navBar'
import { useStateValue } from '../../state';
import useMessagingWebsocket from '@hooks/useMessagingWebsocket';
import "@styles/views/main.scss"

interface Props {
    contentComponent: JSX.Element
}

export const MainView: React.FC<Props> = ({ contentComponent }) => {
    const [, dispatch ] = useStateValue()
    const socket = useMessagingWebsocket();

    useEffect(() => {
        return () => {
            if(socket !== null)
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