import { Request, Response } from 'express';
import openfort from '../config/openfort-client';
import { parseUnits } from "ethers";
import { SendRequest } from "../types";
import { StatusCodeEnum } from "../types/enum";
import { getEnvVariable } from "../utils";

const chainId = parseInt(getEnvVariable('CHAIN_ID'));
const openFortTransactionPolicyId = getEnvVariable('OPENFORT_TRANSACTION_POLICY_ID');
const contractId = getEnvVariable('CONTRACT_ID');

export const sendTransactionHandler = async (req: Request, res: Response) => {
    try {
        const { senderWallet, recipientWallet, amount } = req.body as SendRequest;

        if (!senderWallet || !recipientWallet || !amount) {
            return res.status(StatusCodeEnum.BAD_REQUEST).json({ error: 'Missing transaction details.' });
        }

        // Find the Openfort Account ID (acc_...) from the wallet address (0x...)
        const accountList = await openfort.accounts.list({
            address: senderWallet,
        });

        const account = accountList.data[0];

        if (!account) {
            return res.status(StatusCodeEnum.NOT_FOUND).json({ error: 'Sender wallet not found.' });
        }

        // We need to use the token's decimals to format the amount
        const amountInWei = parseUnits(amount, 6).toString(); // USDC has 6 decimals

        // Define the contract interaction for a standard ERC-20 'transfer'
        const interactionTransfer = {
            contract: contractId,
            functionName: 'transfer',
            functionArgs: [recipientWallet, amountInWei],
        };

        // Create the transaction intent using the correct Openfort Account ID
        const transactionIntent = await openfort.transactionIntents.create({
            account: account.id,
            chainId,
            optimistic: true,
            interactions: [interactionTransfer],
            policy: openFortTransactionPolicyId,
        });

        res.status(StatusCodeEnum.OK).json({
            transactionIntentId: transactionIntent.id,
            status: transactionIntent.response?.status,
            message: 'Transaction intent created successfully.',
        });
    } catch (error) {
        console.error('Transaction error:', error);
        res.status(StatusCodeEnum.INTERNAL_SERVER_ERROR).json({ error: 'Failed to create transaction.' });
    }
};