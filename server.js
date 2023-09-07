const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors"); // Import the cors middleware

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
    },
});
// Use the cors middleware to enable CORS
app.use(cors());

const dots = []; // Store dot data on the server

io.on("connection", (socket) => {
    console.log("A user connected");
    socket.emit("initDots", dots);

    // Listen for "addDot" event from a client
    socket.on("addDot", (newDot) => {
        try {
            // Add the new dot data to the server's dots array
            dots.push(newDot);
            // Broadcast the new dot data to all connected clients
            io.emit("addDot", newDot);
        } catch (error) {
            console.error("Error handling 'addDot' event:", error);
        }
    });

    // Listen for "drag" event from a client
    socket.on("drag", (updatedDot) => {
        try {
            // Update the dot data in the server's dots array
            let foundDot = dots.find((dot) => dot.dotId === updatedDot.dotId);
            if (foundDot) {
                foundDot.x = updatedDot.x;
                foundDot.y = updatedDot.y;
                io.emit("drag", foundDot);
            } else {
                console.error("Dot not found for 'drag' event:", updatedDot);
            }
        } catch (error) {
            console.error("Error handling 'drag' event:", error);
        }
    });

    socket.on("make-public", (updatedDot) => {
        try {
            // Update the dot data in the server's dots array
            let foundDot = dots.find((dot) => dot.dotId === updatedDot.dotId);
            if (foundDot) {
                foundDot.public = true;
                io.emit("make-public", foundDot);
            } else {
                console.error("Dot not found for 'make-public' event:", updatedDot);
            }
        } catch (error) {
            console.error("Error handling 'make-public' event:", error);
        }
    });

    socket.on("save-label", (updatedDot) => {
        try {
            // Update the dot data in the server's dots array
            let foundDot = dots.find((dot) => dot.dotId === updatedDot.dotId);
            if (foundDot) {
                foundDot.label = updatedDot.label;
                io.emit("save-label", updatedDot);
            } else {
                console.error("Dot not found for 'save-label' event:", updatedDot);
            }
        } catch (error) {
            console.error("Error handling 'save-label' event:", error);
        }
    });

    // Handle other events and logic as needed
});

server.listen(3000, () => {
    console.log("Server is running on port 3000");
});