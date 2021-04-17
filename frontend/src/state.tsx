import { createContext, useContext, useReducer, useState } from 'react'
import { GlobalState, GlobalStateAction } from './globalState'

let d: any;
export const StateContext = createContext(d)

export class StateProviderParams {
    reducer: any
    initialState: GlobalState = new GlobalState()
    children: any
}

export const StateProvider = ({reducer, initialState, children}: StateProviderParams) => {
    return <StateContext.Provider value={useReducer(reducer, initialState)}>
        { children }
    </StateContext.Provider>
}

export const useStateValue = () => useContext(StateContext)
 