import { useState, useEffect } from 'react'
import { io } from "socket.io-client";


function useMessagingWebsocket() {
    const [ socket, setSocket ] = useState(io(`${process.env.REACT_APP_WEBSOCKET_URL}`))

    return socket
}

export default useMessagingWebsocket