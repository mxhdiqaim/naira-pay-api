import "dotenv/config";
import server from "./src/server";

const PORT = process.env.PORT || "8081";
const port = parseInt(PORT);

server.on("error", (error: NodeJS.ErrnoException) => {
    const bind = "Port " + port;

    switch (error.code) {
        case "EACCES":
            console.error(bind + " requires elevated privileges");
            return;

        case "EADDRINUSE":
            console.error(bind + " is already in use");
            return;

        default:
            console.error(error);
    }
});

server.on("listening", () => {
    const addr = server.address();
    const bind =
        typeof addr === "string" ? "pipe " + addr : "port " + addr?.port;

    console.log(`Server has been started and listening on ${bind}`);
});

server.listen(port);
