import { useCallback, useContext } from "react"
import { LayoutContext, UserCursor } from "~/context/LayoutContext";
import { SocketContext, UpdateRoomPayload, UpdateRoomTypes } from "~/context/SocketContext"


const useSocket = () => {
    const { socket } = useContext(SocketContext);
    const { roomId } = useContext(LayoutContext)

    const joinRoom = useCallback(() => {
        if (!socket || !roomId) return;
        socket.emit("layout:join", { roomId, user: { name: Math.random() + "" } });
    }, [socket, roomId]);

    const leaveRoom = useCallback(() => {
        if (!socket || !roomId) return;
        socket.emit("layout:leave", { roomId });
    }, [socket, roomId]);

    const updateUserMouse = useCallback(
        (userCursor: UserCursor) => {
            if (!socket || !roomId) return;
            socket.volatile.emit("layout:mouse-update", { roomId, userCursor });
        },
        [roomId, socket]
    );

    const updateRoom = useCallback(
        (data: Node[], type: UpdateRoomTypes) => {
          if (!socket || !roomId) return;
          const payload: UpdateRoomPayload = {
            roomId,
            data,
            type,
          };
          socket.emit("layout:update", payload);
        },
        [socket, roomId]
    );

    const deleteRoomNodes = useCallback(
        (nodes: any[]) => {
          if (!socket || !roomId) return;
          const payload = {
            roomId,
            data: nodes,
          };
          socket.emit("layout:delete-nodes", payload);
        },
        [socket, roomId]
    );

    return { joinRoom, leaveRoom, updateUserMouse, updateRoom, deleteRoomNodes }
}

export default useSocket;