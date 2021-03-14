import { User } from "../models/User"
import { acceptFriendRequest } from '../../helpers/api'

type FRAcceptCardProps = {
    userData: User
    friendRequestId: number
    refreshList: Function
}

function FriendRequestAcceptCard({ userData, friendRequestId, refreshList }: FRAcceptCardProps) {

    const acceptFriendRequestHandler = async () => {
        const authToken: string = localStorage.getItem("authToken")?.toString() 
            || localStorage.getItem("authToken")!.toString()
        
        const resp: any = await acceptFriendRequest(friendRequestId, authToken)

        console.log(resp)
        if(resp.status === "success")
            refreshList()
    }

    return <article className="user-add-card">
        <img src={ userData.profilePic } />
        <label>{ userData.nomeProprio + " " + userData.apelido }</label>
        <button 
            className="btn"
            onClick={acceptFriendRequestHandler}>Accept</button>
    </article>
}

export default FriendRequestAcceptCard