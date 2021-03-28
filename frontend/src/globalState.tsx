import { UserData } from "./models/UserData"

export class GlobalState {
    userData: UserData = new UserData()
    socket: any = null;
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
        case 'changeSocket':
            return {
                ...state,
                socket: action.value
            }
        default:
            return state
    }
}