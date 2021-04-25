const http = require("http");

const server = http.createServer();
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: "*",
  },
});

io.on("connection", (socket) => {
  console.log("new connection", socket.id);
  socket.on("broadcast_message", (data) => {
    console.log(data);
    socket.broadcast.emit("new_broadcast_message", data);
  });
  socket.on("specific_message", (data) => {
    const userId = data.userId;
    const message = data.message;
    io.to(userId).emit("new_specific_message", message);
  });

  socket.on("subscribe_to_room", (room) => {
    socket.join(room);
  });

  socket.on("message_to_room", (data) => {
    const group = data.group;
    const message = data.message;
    socket.to(group).emit("new_specific_group_message", message);
  });
});

server.listen(3000, (err) => {
  if (err) return console.log(err);
  return console.log("started server on port 3000");
});
