import app from "./app.js";
import http from "http";
import { Server } from "socket.io";
import { ACTIONS } from "./actions.js";

const port = 8000;

const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: { origin: "http://127.0.0.1:5173", methods: ["GET", "POST"] },
});

const socketUserMap = {};

io.on("connection", (socket) => {
  console.log("socket", socket.id);

  socket.on(ACTIONS.JOIN, ({ roomId, user }) => {
    // console.log("user", user);
    // console.log("roomId", roomId);
    console.log("socketUserMap", socketUserMap);

    socketUserMap[socket.id] = user;

    const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);

    clients.forEach((clientId) => {
      io.to(clientId).emit(ACTIONS.ADD_PEER, {
        peerId: socket.id,
        createOffer: false,
        user,
      });

      socket.emit(ACTIONS.ADD_PEER, {
        peerId: clientId,
        createOffer: true,
        user: socketUserMap[clientId],
      });
    });

    socket.join(roomId);

    console.log("clients", clients);
  });

  socket.on(ACTIONS.RELAY_ICE, ({ peerId, icecandidate }) => {
    io.to(peerId).emit(ACTIONS.ICE_CANDIDATE, {
      peerId: socket.id,
      icecandidate,
    });
  });

  socket.on(ACTIONS.RELAY_SDP, ({ peerId, sessionDescription }) => {
    io.to(peerId).emit(ACTIONS.SESSION_DESCRIPTION, {
      peerId: socket.id,
      sessionDescription,
    });
  });

  const leaveRoom = ({ roomId }) => {
    const { rooms } = socket;

    Array.from(rooms).forEach((roomId) => {
      const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);

      clients.forEach((clientId) => {
        io.to(clientId).emit(ACTIONS.REMOVE_PEER, {
          peerId: socket.id,
          userId: socketUserMap[socket.id].id,
        });

        socket.emit(ACTIONS.REMOVE_PEER, {
          peerId: clientId,
          userId: socketUserMap[clientId].id,
        });
      });

      socket.leave(roomId);
    });
    delete socketUserMap[socket.id];
  };

  // leaving the room
  socket.on(ACTIONS.LEAVE, leaveRoom);
  socket.on("disconnecting", leaveRoom);
});

httpServer.listen(port, () =>
  console.log(`server is running on http://localhost:${port} `)
);
