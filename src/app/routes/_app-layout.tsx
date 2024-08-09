import type { Socket } from "socket.io-client";
import io from "socket.io-client";
import { Outlet } from "@remix-run/react";
import { Provider } from "react-redux";

import { SocketContextProvider } from "src/app/context/SocketContext";
import { LayoutContextProvider } from "src/app/context/LayoutContext";

import appStyles from "~/styles/app.css?url"

export const links = () => [
  { rel: "stylesheet", href: appStyles },
];

export default function AppLayout() {


    return (
      <>
        
            <Outlet/>
          
        {/* <SocketProvider socket={socket}> */}
          {/* <Provider store={store}> */}
          {/* </Provider> */}
        {/* </SocketProvider> */}

      </>
    );
  }