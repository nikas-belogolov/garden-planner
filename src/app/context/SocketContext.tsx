import { createContext, useCallback, useContext, useEffect, useMemo } from "react";
import socketIOClient, { Socket } from "socket.io-client";
import { LayoutContext, RoomUser, UserCursor } from "./LayoutContext";

type Props = {
    children: React.ReactNode;
};

type ISocketContext = {
    socket: Socket;
};

export type UpdateRoomTypes = "update" | "history";

export type UpdateRoomPayload = {
  roomId: string;
  type: UpdateRoomTypes;
  data: Node[];
};

export type GetUserMouseUpdatePayload = {
    socketId: string;
    userCursor: UserCursor;
};

export type UserJoinedPayload = {
    socketId: string;
    user: RoomUser;
};

type EventCallback = (...args: any[]) => void;

type Events = {
  [key: string]: EventCallback;
};

export const SocketContext = createContext<ISocketContext>({} as ISocketContext);

const socket = socketIOClient("/");

export const SocketContextProvider: React.FC<Props> = ({ children }) => {
    const { setRoomUsers, setUserCursors, upsertNode, deleteNode } = useContext(LayoutContext);

    const connectionSuccess = useCallback(() => {
        console.log("connection successful!");
    }, []);

    const getRoomUsers = useCallback(
      (payload: UserJoinedPayload[]) => {
        const userCursors: Map<string, UserCursor> = new Map();
        const roomUsers: Map<string, RoomUser> = new Map();
        payload.forEach((user) => {
          roomUsers.set(user.socketId, user.user);
          userCursors.set(user.socketId, { x: 0, y: 0 });
        });
        setRoomUsers(roomUsers);
        setUserCursors(userCursors);
        console.log(userCursors)
      },
      [setRoomUsers, setUserCursors]
    )

    const getUserMouseUpdate = useCallback(
        (payload: GetUserMouseUpdatePayload) => {
          const { socketId, userCursor }: { userCursor: UserCursor, socketId: any } = payload;
          setUserCursors((prevState: any) => {
            prevState.set(socketId, userCursor);
            return new Map(prevState);
          });
          // console.log(socketId, userCursor)
        },
        [setUserCursors]
    );

    const userJoined = useCallback(
        (payload: UserJoinedPayload) => {
          const { socketId, user } = payload;
          setRoomUsers((prevState) => {
            prevState.set(socketId, user);
            return new Map(prevState);
          });
          setUserCursors((prevState) => {
            prevState.set(socketId, { x: 0, y: 0 });
            return new Map(prevState);
          });
        },
        [setRoomUsers, setUserCursors]
    );

    const userLeft = useCallback(
      ({ socketId }: { socketId: string }) => {
        setRoomUsers((prevState) => {
          prevState.delete(socketId);
          return new Map(prevState);
        });
        setUserCursors((prevState) => {
          prevState.delete(socketId);
          return new Map(prevState);
        });
      },
      [setRoomUsers, setUserCursors]
    );

    const getRoomUpdate = useCallback(
      (payload: UpdateRoomPayload) => {
        const { data } = payload;
        if (payload.type === "update") {
          if (data) {
            data.forEach((node: any) => {
              upsertNode(node);
            });
          }
        }
      },
      [upsertNode]
    )

    const getRoomDeleteNodes = useCallback(
      (payload: DeleteRoomNodesPayload) => {
        const { data } = payload;
        if (data) {
          data.forEach((node: any) => {
            deleteNode(node._id)
          })
        }
      },
      [deleteNode]
    );

    

    

    useEffect(() => {
      const events = {
        "connection-success": connectionSuccess,
        "layout:mouse-update": getUserMouseUpdate,
        "layout:update": getRoomUpdate,
        "layout:delete-nodes": getRoomDeleteNodes,
        "layout:get-room-users": getRoomUsers,
        "layout:user-joined": userJoined,
        "layout:user-left": userLeft
      }

      for (const eventName in events) {
        socket.on(eventName, events[eventName as keyof typeof events]);
      }

      return () => {
        for (const eventName in events) {
          socket.off(eventName, events[eventName as keyof typeof events]);
        }
      }
    });

    
    const value = useMemo(
        () => ({
          socket,
        }),
        []
    );

    return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
}