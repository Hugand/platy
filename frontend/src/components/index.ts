
// Importing views
import LoginView from './views/login-view'
import MainView from './views/main-view'
import HomeView from './views/home-view'
import SearchView from './views/search-view'
import FriendRequestsView from './views/friend-requests'
import UserProfileViewfrom from './views/user-profile-view'

// Importing blocks
import NavBar from './blocks/nav-bar'
import RecentChatsBar from './blocks/recent-chats-bar'
import FriendsListModal from './blocks/friends-list-modal'
import EditProfileModal from './blocks/edit-profile-modal'
import SearchUserToChatModal from './blocks/search-user-to-chat-modal'

// Importing atoms
import TextField from './atoms/text-field'
import ChatListCard from './atoms/chat-list-card'
import UserAddCard from './atoms/user-add-card'
import FriendRequestAcceptCard from './atoms/friend-request-accept-card'
import UserSelectCard from './atoms/user-select-card'



export {
    // Views
    LoginView,
    MainView,
    HomeView,
    SearchView,
    FriendRequestsView,
    UserProfileViewfrom,

    // Blocks
    NavBar,
    RecentChatsBar,
    FriendsListModal,
    EditProfileModal,
    SearchUserToChatModal,

    // Atoms
    TextField,
    ChatListCard,
    UserAddCard,
    FriendRequestAcceptCard,
    UserSelectCard
}