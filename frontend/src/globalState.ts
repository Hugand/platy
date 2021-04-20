import { Chat } from "./models/Chat";
import { User } from "./models/User";
import { UserData } from "./models/UserData"
import { RecentChat } from "./models/RecentChat"
import { clearSession, getFriendFromFriendship } from "./helpers/api";
import reducers from "@helpers/globalStateReducers";
import { GlobalState, GlobalStateAction } from "@models/GlobalStateData";

export const initialState = new GlobalState()

export const reducer = (state: GlobalState, action: GlobalStateAction) => {
    const actionFunction = reducers.get(action.type)
    if (actionFunction !== undefined) return actionFunction(state, action)
    else return state
}