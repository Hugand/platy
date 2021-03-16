import "../../styles/blocks/navbar.scss"
import searchIcon from '../../assets/img/search_icon.svg'
import homeIcon from '../../assets/img/home_icon.svg'
import logoutIcon from '../../assets/img/logout_icon.svg'
import friendsIcon from '../../assets/img/friends_icon.svg'
import { Link } from "react-router-dom"
import { useStateValue } from "../../state"
import { useEffect } from "react"
import { GlobalStateAction } from "../../globalState"
import { getUserData } from "../../helpers/api"
import { UserData } from "../models/UserData"


function NavBar() {
    const [ { userData }, dispatch ] = useStateValue()
    
    useEffect(() => {
        handleGetUserData()
    }, [])

    const handleGetUserData = async () => {
        const authToken: string = localStorage.getItem("authToken")?.toString() 
            || localStorage.getItem("authToken")!.toString()
    
        const res: UserData = await getUserData(authToken)

        const dispatchData: GlobalStateAction = {
            type: 'changeUser',
            value: res
        }

        dispatch(dispatchData)
    }


    return <div className="navbar">
        <Link to="/profile">
            <img className="profile-pic" src={ userData.user.profilePic } alt="profile pic"/>
        </Link>
        <Link to="/">
            <button className="navbar-btn"><img src={homeIcon} alt="icon"/></button>
        </Link>
        <Link to="/search">
            <button className="navbar-btn"><img src={searchIcon} alt="icon"/></button>
        </Link>
        <Link to="/friend_requests">
            <button className="navbar-btn"><img src={friendsIcon} alt="icon"/></button>
        </Link>
        <button className="navbar-btn logout"><img src={logoutIcon} alt="icon"/></button>
    </div>
}

export default NavBar;