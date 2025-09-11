import express from "express";
import { authHandler } from "../handlers/auth";
// import { protectedRoute } from "../config/jwt-config";

const router = express.Router();

router.post("/social", authHandler);

export = router;