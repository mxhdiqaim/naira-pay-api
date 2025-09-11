import express from "express";


import auth from "./auth-route";


const router = express.Router();

// Public authentication routes
router.use("/auth", auth);

export default router;