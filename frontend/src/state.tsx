import { GlobalState } from '@/models/globalStateData/GlobalState';
import { GlobalStateAction } from '@/models/globalStateData/GlobalStateAction';
import { User } from '@/models/User';
import { createContext, Dispatch, useContext, useReducer } from 'react';

export interface StoreCtx {
    state: GlobalState;
    dispatch: React.Dispatch<GlobalStateAction>;
}

export interface StateProviderParams {
    reducer: StateReducerFunction;
    initialState: GlobalState;
    children: JSX.Element;
}

export type StateReducer = Map<string, StateReducerFunction>;
export type StateReducerFunction = (state: GlobalState, action: GlobalStateAction) => GlobalState;

const defaultState: GlobalState = new GlobalState();
const StateContext = createContext<StoreCtx>({ state: defaultState, dispatch: (value: GlobalStateAction) => {} });

// export const StateContext = createContext(myContext);
export const useStateValue = () => useContext(StateContext);

export const StateProvider: React.FC<StateProviderParams> = ({ reducer, initialState, children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    return <StateContext.Provider value={{ state, dispatch }}>{children}</StateContext.Provider>;
};
