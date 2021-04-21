import reducers from "./helpers/globalStateReducers";
import { GlobalState, GlobalStateAction } from "./models/GlobalStateData";

export const initialState = new GlobalState()

export const reducer = (state: GlobalState, action: GlobalStateAction) => {
    const actionFunction = reducers.get(action.type)
    if (actionFunction !== undefined) return actionFunction(state, action)
    else return state
}