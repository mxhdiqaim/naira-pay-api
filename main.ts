import "dotenv/config";

(async () => {

    const port = parseInt(process.env.PORT || "5473");
    const server = (await import("./src/server")).default;

    server.on("error", (error: NodeJS.ErrnoException) => {
        const bind = "Port " + port;

        switch (error.code) {
            case "EACCES":
                console.error(bind + " requires elevated privileges");
                process.exit(1);
                break;
            case "EADDRINUSE":
                console.error(bind + " is already in use");
                process.exit(1);
                break;
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
