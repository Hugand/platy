import { createContext, useContext, useReducer, useState } from 'react'
import { GlobalState } from '@models/GlobalStateData';

let d: any;
export const StateContext = createContext(d)

export class StateProviderParams {
    reducer: any
    initialState: GlobalState = new GlobalState()
    children: any
}

export const StateProvider = ({ reducer, initialState, children }: StateProviderParams) => {
    const globalState = useReducer(reducer, initialState)

    return <StateContext.Provider value={globalState}>
        { children }
    </StateContext.Provider>
}

export const useStateValue = () => useContext(StateContext)
 