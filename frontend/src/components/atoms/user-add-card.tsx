import '../../styles/atoms/user-add-card.scss'
import { sendFriendRequest } from '../../helpers/api'

function UserAddCard({ userData }:any) {
    const sendFriendRequestHandler = async () => {
        const authUserToken: string | null = localStorage.getItem("authToken")
        if(authUserToken !== null) {
            const res = await sendFriendRequest(userData.id, authUserToken)
            console.log(res)
        }
    }

    return <article className="user-add-card">
        <img src={ userData.profilePic } />
        <label>{ userData.nomeProprio + " " + userData.apelido }</label>
        <button className="btn" onClick={sendFriendRequestHandler}>Add friend</button>
    </article>
}

export default UserAddCard