import { useStateValue } from '../../state'
import '../../styles/views/profile.scss'

function UserProfileView() {
    // const [ userData, setUserData ] = useState(new UserData())
    const [ { userData } ] = useStateValue()

    return <section className="content-container">
        <section className="profile-container">
            <div className="banner"></div>

            <div className="profile-content">
                <img src={ userData.user.profilePic } alt="profile pic"/>
                <h1>{ `${userData.user.nomeProprio} ${userData.user.apelido}` }</h1>
                <h2>{ userData.user.username }</h2>
                <h3>{ userData.friendsCount } friends</h3>
                <button className="btn">Edit</button>
                <hr/>
                <button className="btn btn-secondary">Logout</button>
            </div>
        </section>
   </section>
}

export default UserProfileView