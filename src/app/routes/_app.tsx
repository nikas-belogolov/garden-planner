import { Outlet } from "@remix-run/react";
import { LayoutContextProvider } from "src/app/context/LayoutContext";
import { SocketContextProvider } from "src/app/context/SocketContext";

export default function AppLayout() {


    return (
        <>
            
                    <Outlet/>
                
        </>
    )
}