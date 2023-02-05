import React, { useMemo } from 'react'
import {io} from "socket.io-client"


const Socketcontext=React.createContext(null);
     
 
export const useSocket=()=>{
    return React.useContext(Socketcontext)
}

export const SocketProvider =(props)=>{
    const socket=useMemo(()=>io('http://localhost:8001'),[])
    return(
        <Socketcontext.Provider value={{socket}}>
            {props.children}
        </Socketcontext.Provider>
    )
}