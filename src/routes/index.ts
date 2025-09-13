import express from "express";
import authRoute from "./auth-route";
import { sendTransactionHandler } from "../handlers/send-transaction";
import { getBalanceHandler } from "../handlers/get-balance";
import { getTransactionHistoryHandler } from "../handlers/get-transaction-history";
import {startRecoveryHandler} from "../handlers/start-recovery";

const router = express.Router();

// Authentication route
router.use('/auth', authRoute);

router.post('/account/start-recovery', startRecoveryHandler);

router.post('/wallet/send', sendTransactionHandler);
router.get('/wallet/:walletAddress/balance', getBalanceHandler);

router.get('/player/:playerId/transactions', getTransactionHistoryHandler);

export default router;