import "dotenv/config";

const PORT = process.env.PORT || "8081";

(async () => {

    const port = parseInt(PORT);
    const server = (await import("./src/server")).default;

    server.on("error", (error: NodeJS.ErrnoException) => {
        const bind = "Port " + port;

        switch (error.code) {
            case "EACCES":
                console.error(bind + " requires elevated privileges");
                process.exit(1);
            case "EADDRINUSE":
                console.error(bind + " is already in use");
                process.exit(1);
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
})();
