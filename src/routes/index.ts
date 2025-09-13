import express from "express";
import { authHandler } from "../handlers/auth";
import { sendTransactionHandler } from "../handlers/send-transaction";
import { getBalanceHandler } from "../handlers/get-balance";
import {getTransactionHistoryHandler} from "../handlers/get-transaction-history";

const router = express.Router();

router.post('/auth/social', authHandler);
router.post('/wallet/send', sendTransactionHandler);
router.get('/wallet/:walletAddress/balance', getBalanceHandler);

router.get('/player/:playerId/transactions', getTransactionHistoryHandler);

export default router;