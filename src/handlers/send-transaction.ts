import { Request, Response } from 'express';
import Openfort from '@openfort/openfort-node';
import {parseUnits} from "ethers";
import {SendRequest} from "../types";
import {StatusCodeEnum} from "../types/enum";

const openForSecretKey = process.env.OPENFORT_SECRET_KEY;

if (!openForSecretKey) {
    throw new Error('OPENFORT_SECRET_KEY is not defined in environment variables');
}

// Initialise the Openfort client and your backend developer account
const openfort = new Openfort(openForSecretKey as string);

// It will be used to pay for gas.
const openFortDeveloperAccountId = process.env.OPENFORT_DEVELOPER_ACCOUNT_ID;
if (!openFortDeveloperAccountId) {
    throw new Error('OPENFORT_DEVELOPER_ACCOUNT_ID is not defined in environment variables');
}

const usdcContractId =  process.env.USDC_CONTRACT_ID; // This will be replaced with the actual USDC contract ID on Polygon Mumbai
if (!usdcContractId) {
    throw new Error('USDC_CONTRACT_ID is not defined in environment variables');
}

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