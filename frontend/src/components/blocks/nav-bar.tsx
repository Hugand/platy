import "../../styles/blocks/navbar.scss"
import searchIcon from '../../assets/img/search_icon.svg'
import homeIcon from '../../assets/img/home_icon.svg'
import logoutIcon from '../../assets/img/logout_icon.svg'

function NavBar() {
    return <div className="navbar">
        <label className="logo">WC</label>
        <button className="navbar-btn"><img src={homeIcon}/></button>
        <button className="navbar-btn"><img src={searchIcon}/></button>
        <button className="navbar-btn logout"><img src={logoutIcon}/></button>
    </div>
}

export default NavBar;