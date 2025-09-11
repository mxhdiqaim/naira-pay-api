import { Request, Response } from 'express';
import Openfort from '@openfort/openfort-node';
import {parseUnits} from "ethers";
import {SendRequest} from "../types";
import {StatusCodeEnum} from "../types/enum";
import {getEnvVariable} from "../utils";

// Get environment variables using the utility function
const openForSecretKey = getEnvVariable('OPENFORT_SECRET_KEY');
const openFortDeveloperAccountId = getEnvVariable('OPENFORT_DEVELOPER_ACCOUNT_ID');
const usdcContractId = getEnvVariable('USDC_CONTRACT_ID');

// Initialise the Openfort client and your backend developer account
const openfort = new Openfort(openForSecretKey);

export const sendTransactionHandler = async (req: Request, res: Response) => {
    try {
        const { senderWallet, recipientWallet, amount } = req.body as SendRequest;

        if (!senderWallet || !recipientWallet || !amount) {
            return res.status(StatusCodeEnum.BAD_REQUEST).json({ error: 'Missing transaction details.' });
        }

        // We need to use the token's decimals to format the amount
        const amountInWei = parseUnits(amount, 6).toString(); // USDC has 6 decimals

        // Define the contract interaction for a standard ERC-20 'transfer'
        const interactionTransfer = {
            contract: usdcContractId,
            functionName: 'transfer',
            functionArgs: [recipientWallet, amountInWei],
        };

        // Create the transaction intent
        const transactionIntent = await openfort.transactionIntents.create({
            account: senderWallet, // The user's wallet
            chainId: 80001, // Polygon Mumbai Testnet
            optimistic: true, // Speeds up the transaction confirmation
            interactions: [interactionTransfer],
            policy: openFortDeveloperAccountId, // Use the developer account to sponsor gas
        });

        res.status(StatusCodeEnum.OK).json({
            transactionIntentId: transactionIntent.id,
            // status: transactionIntent.status,
            message: 'Transaction intent created successfully.',
        });
    } catch (error) {
        console.error('Transaction error:', error);
        res.status(StatusCodeEnum.INTERNAL_SERVER_ERROR).json({ error: 'Failed to create transaction.' });
    }
};