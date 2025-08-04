import { createContext, useContext, useMemo, type ReactNode } from "react";
import { io, Socket } from "socket.io-client";

const SocketContext = createContext<Socket | null>(null);

export const useSocket = () => {
    const socket = useContext(SocketContext);
    return socket;
}

export default function SocketProvider({ children }: { children: ReactNode }) {
    const socket = useMemo(()=>{
        return io(`${import.meta.env.VITE_BACKEND_URL}`)
        // return io('192.168.0.6:3000')
    },[]);
    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    )
}