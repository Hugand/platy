import "../../styles/blocks/navbar.scss"
import searchIcon from '../../assets/img/search_icon.svg'
import homeIcon from '../../assets/img/home_icon.svg'
import logoutIcon from '../../assets/img/logout_icon.svg'
import friendsIcon from '../../assets/img/friends_icon.svg'
import { Link } from "react-router-dom"


function NavBar() {
    return <div className="navbar">
        <label className="logo">WC</label>
        <Link to="/">
            <button className="navbar-btn"><img src={homeIcon}/></button>
        </Link>
        <Link to="/search">
            <button className="navbar-btn"><img src={searchIcon}/></button>
        </Link>
        <Link to="/friend_requests">
            <button className="navbar-btn"><img src={friendsIcon}/></button>
        </Link>
        <button className="navbar-btn logout"><img src={logoutIcon}/></button>
    </div>
}

export default NavBar;