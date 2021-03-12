import { TextField, UserAddCard } from '..'
import '../../styles/views/search.scss'
import { User } from '../models/User'

function SearchView() {
    const templateUser: User = {
        profilePic: "https://avatars.githubusercontent.com/u/24555587?s=460&u=60f5d30868fc8148ed0c65b7a863ec53431329b0&v=4",
        nomeProprio: "Hugo", apelido: "Gomes",
        email: "", username: "", uid: "", id: 1
    }

    return <section className="search-view-container">
        <div className="content">
            <header>
                <h2>Find new friends</h2>
                <TextField placeholder="Search" onInputChange={(s: string) => console.log(s)}/>
            </header>

            <div className="users-list">
                 { new Array(15).fill(<UserAddCard userData={templateUser} />)}
            </div>
        </div>
    </section>
}

export default SearchView