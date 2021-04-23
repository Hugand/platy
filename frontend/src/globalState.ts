import { GlobalState } from "@/models/globalStateData/GlobalState";
import { GlobalStateAction } from "@/models/globalStateData/GlobalStateAction";
import reducers from "./helpers/globalStateReducers";

export const initialState = new GlobalState();

export const globalStateReducer = (state: GlobalState, action: GlobalStateAction): GlobalState => {
    const actionFunction = reducers.get(action.type);
    if (actionFunction !== undefined)return actionFunction(state, action);
    else return state;
};
