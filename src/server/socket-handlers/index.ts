import { Server } from "socket.io";
import sharedSession from "express-socket.io-session";
import layoutSocketHandler from "./layout-socket-handler.js";

import passport from "passport"

import User from "../models/UserModel.js";

function onlyForHandshake(middleware) {
  return (req, res, next) => {
    const isHandshake = req._query.sid === undefined;
    if (isHandshake) {
      middleware(req, res, next);
    } else {
      next();
    }
  };
}

const socketServer = (httpServer, sessionMiddleware) => {
  const io = new Server(httpServer);

  io.engine.use(onlyForHandshake(sessionMiddleware))
  io.engine.use(onlyForHandshake(passport.session()))

  io.engine.use(onlyForHandshake((req, res, next) => {
    console.log("Handshake");
    next()
  }))

  io.use((socket, next) => {
    //console.log(socket.)
    next();
  })

  io.on("connection", async (socket) => {
    console.log("a client has connected");

    socket.emit("connection-success");

    layoutSocketHandler(socket);

    socket.on("disconnect", () => {
      console.log("a client has disconnected");
    });
  });
}

export default socketServer;