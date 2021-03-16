import { UserData } from "./components/models/UserData"

export class GlobalState {
    userData: UserData = new UserData()
}

export class GlobalStateAction {
    type: string = ""
    value: any
}

export const initialState = new GlobalState()

export const reducer = (state: UserData, action: GlobalStateAction) => {
    switch(action.type) {
        case 'changeUser':
            return {
                ...state,
                userData: action.value
            }
        default:
            return state
    }
}