import '../../styles/atoms/user-select-card.scss'
import { User } from '../../models/User'

type UserSelectCardProp = {
    userData: User;
    selectHandler: Function;
}

function UserSelectCard({ userData, selectHandler }: UserSelectCardProp) {
    return <article className="user-select-card" onClick={() => selectHandler(userData)}>
        <img src={ `data:image/png;base64, ${ userData.profilePic}` } alt="profile pic"/>
        <label>{ userData.nomeProprio + " " + userData.apelido }</label>
    </article>
}

export default UserSelectCard