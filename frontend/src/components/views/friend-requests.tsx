import { useState, useEffect } from 'react'
import { FriendRequest } from '../models/FriendRequest'
import { getFriendRequestList } from '../../helpers/api'
import '../../styles/views/friend-requests.scss'
import { FriendRequestAcceptCard } from '..'

function FriendRequestsView() {
    const [ friendRequests, setFriendRequests ] = useState(Array<FriendRequest>())

    useEffect(() => {
        getFriendRequestsData()
    }, [])

    const getFriendRequestsData = async () => {
        const authToken: string = localStorage.getItem("authToken")?.toString() 
            || localStorage.getItem("authToken")!.toString()
        console.log(authToken)
        const res = await getFriendRequestList(authToken)

        console.log(res)

        setFriendRequests(res)
    }

    return <section className="fr-view-container">
        <div className="content">
            <header>
                <h2>Friend Requests</h2>
            </header>

            <div className="users-list">
                { friendRequests.length === 0
                ? <h2>No incoming friend requests</h2>
                : friendRequests.map(fr => <FriendRequestAcceptCard userData={fr.requestOriginUser}/>) }
            </div>
        </div>
    </section>
}

export default FriendRequestsView