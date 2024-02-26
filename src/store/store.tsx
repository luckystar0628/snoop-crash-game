import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { gameParamsType, initialPrams, initialValue, storeType } from "../@types";
import axios from "axios";

export const globalContext = createContext<storeType>(initialValue);
const StoreProvider = (props: { children: ReactNode }) => {
    const [gameParams, setGameParams] = useState<gameParamsType>(initialPrams)
    useEffect(() => {
        axios.defaults.headers.common['token'] = "c42ca54b-0e44-4348-95c5-f0c058334847";
        axios.defaults.baseURL = "http://localhost:3001"
        axios.defaults.timeout = 20000
    }, [])
    return (
        <globalContext.Provider value={{ gameParams, setGameParams }}>
            {props.children}
        </globalContext.Provider>
    )
}

const useGameParams = () => ({
    gameParams: useContext(globalContext).gameParams,
    setGameParams: useContext(globalContext).setGameParams
})

export default StoreProvider;
export { useGameParams };
