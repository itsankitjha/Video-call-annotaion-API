const app = require("express")();
const server = require("http").createServer(app);
const cors = require("cors");

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
app.use(cors());
const PORT = process.env.PORT || 5000;
//Test
function onConnection(socket) {
  socket.on("drawing", (data) => socket.broadcast.emit("drawing", data));

  socket.emit("me", socket.id);

  socket.on("disconnect", () => {
    socket.broadcast.emit("callEnded");
  });

  socket.on("callUser", ({ userToCall, signalData, from, name }) => {
    io.to(userToCall).emit("callUser", { signal: signalData, from, name });
  });

  socket.on("answerCall", (data) => {
    io.to(data.to).emit("callAccepted", data.signal);
  });
}
app.get("/", (req, res) => {
  res.send("Running");
});

io.on("connection", onConnection);

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
