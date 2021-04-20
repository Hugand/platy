import { useState, useEffect } from 'react'
import { FriendRequest } from '@models/FriendRequest'
import { acceptFriendRequest, cancelFriendRequest, clearSession, getFriendRequestList } from '@helpers/api'
import '@styles/views/friend-requests.scss'
import { UserCard } from '@atoms/userCard'

export const FriendRequestsView: React.FC = () => {
    const [ friendRequests, setFriendRequests ] = useState(Array<FriendRequest>())

    useEffect(() => {
        getFriendRequestsData()
    }, [])

    const getFriendRequestsData = async () => {
        const authToken: string = localStorage.getItem("authToken") || ''
        try {
            const res = await getFriendRequestList(authToken)
            setFriendRequests(res)
        } catch (e) {
            clearSession()
        }
    }

    const handleFriendRequest = async (friendRequest: FriendRequest, accept: boolean) => {
        const authToken: string = localStorage.getItem("authToken") || ''
        try {
            let resp: any;

            if(accept)
                resp = await acceptFriendRequest(friendRequest.id, authToken)
            else
                resp = await cancelFriendRequest(friendRequest.requestOriginUser.id, authToken)
    
            if(resp.status === "success")
                getFriendRequestsData()
        } catch (e) {
            clearSession()
        }
    }

    return <section className="fr-view-container">
        <div className="content">
            <header>
                <h2>Friend Requests</h2>
            </header>

            <div className="users-list">
                { friendRequests.length === 0
                ? <h2>No incoming friend requests</h2>
                    : friendRequests.map(fr =>
                        <UserCard
                            key={fr.id}
                            user={fr.requestOriginUser}
                            actionButton={<>
                                <button
                                    className='btn'
                                    onClick={e => handleFriendRequest(fr, true)}>Accept</button>
                                <button
                                    className='btn btn-secondary-red'
                                    onClick={e => handleFriendRequest(fr, false)}>Decline</button>
                            </>}
                        />
                )}
            </div>
        </div>
    </section>
}