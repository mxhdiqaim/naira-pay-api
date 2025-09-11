import express from "express";


// import auth from "./auth-route";
import {authHandler} from "../handlers/auth";
import {sendTransactionHandler} from "../handlers/send-transaction";


const router = express.Router();

// Public authentication routes
// router.use("/auth", auth);

router.post('/auth/social', authHandler);
router.post('/wallet/send', sendTransactionHandler);

export default router;