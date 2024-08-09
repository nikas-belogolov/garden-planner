import { Socket } from "socket.io";

import { randomColor } from "../utils";
const roomUsers = new Map();
const layoutSocketHandler = (socket: Socket) => {
    

    const joinRoom = ({ roomId, user }) => {
        console.log(roomUsers)
        const currUsers = roomUsers.get(roomId);
        const color = randomColor();
        if (!currUsers) {
            roomUsers.set(roomId, {
                colorIdx: 1,
                users: [{
                    socketId: socket.id,
                    user: {
                        ...user,
                        color
                    } }],
            });
            console.log(roomUsers)

        } else {
            console.log("Current users", currUsers.users)
            socket.emit("layout:get-room-users", currUsers.users);
            roomUsers.set(roomId, {
                users: [
                    ...currUsers.users,
                    {
                        socketId: socket.id,
                        user: {
                            ...user,
                            color
                        }
                    }],
            });
        }

        socket.join(roomId);
        console.log(`a client has joined room ${roomId}`);
        socket.broadcast.to(roomId).emit("layout:user-joined", { socketId: socket.id, user: {  ...user, color} });
    }

    const leaveRoom = ({ roomId }) => {
        if (socket.rooms.has(roomId)) {
            socket.leave(roomId);
            console.log(`a client has left a room ${roomId}`);
            const currUsers = roomUsers.get(roomId);
            if (currUsers) {
              roomUsers.set(roomId, { ...currUsers, users: currUsers.users.filter((user) => user.socketId !== socket.id) });
            }

            // Delete room if no users
            if (roomUsers.get(roomId)?.users.length === 0) {
              roomUsers.delete(roomId);
            }
            socket.broadcast.to(roomId).emit("layout:user-left", { socketId: socket.id });
        }
    }

    // const isAuthorized = () => {
    //     const user = socket.handshake.session.user;
        
    // }

    const updateUserMouse = ({ roomId, userCursor }) => {
        socket.volatile.broadcast.to(roomId).emit("layout:mouse-update", { socketId: socket.id, userCursor });
    }

    const updateRoom = (payload) => {
        // console.log(payload, socket.request.user)
        const { roomId } = payload;
        if (socket.rooms.has(roomId)) {
          socket.broadcast.to(roomId).emit("layout:update", payload);
        }
    };

    const deleteRoomNodes = (payload) => {
        const { roomId } = payload;
        if (socket.rooms.has(roomId)) {
          socket.broadcast.to(roomId).emit("layout:delete-nodes", payload);
        }
    };

    socket.on("layout:join", joinRoom);
    socket.on("layout:leave", leaveRoom);
    socket.on("layout:mouse-update", updateUserMouse);
    socket.on("layout:update", updateRoom);
    socket.on("layout:delete-nodes", deleteRoomNodes);

    socket.on("disconnecting", () => {
        socket.rooms.forEach((roomId) => {
          if (roomId !== socket.id) {
            leaveRoom({ roomId });
          }
        });
    });
}

export default layoutSocketHandler;