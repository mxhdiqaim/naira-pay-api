import express from "express";
import { authHandler } from "../handlers/auth";
import {recoverAccountHandler} from "../handlers/recover-account";

const router = express.Router();

router.post('/social', authHandler);
router.post('/recover', recoverAccountHandler);

export default router;