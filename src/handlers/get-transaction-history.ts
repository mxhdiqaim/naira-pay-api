import { Request, Response } from 'express';
import openfort from '../config/openfort-client';
import { StatusCodeEnum } from '../types/enum';

export const getTransactionHistoryHandler = async (req: Request, res: Response) => {
    try {
        const { playerId } = req.params;

        if (!playerId) {
            return res.status(StatusCodeEnum.BAD_REQUEST).json({ error: 'Player ID is required.' });
        }

        // Use Openfort's SDK to list all transaction intents for the player
        const transactionIntents = await openfort.transactionIntents.list({
            player: [playerId],
            limit: 20,
        });

        // The response contains a 'data' array with the transaction objects
        const { data } = transactionIntents;

        // Return the list of transaction intents
        res.status(StatusCodeEnum.OK).json({ data });

    } catch (error) {
        console.error('Transaction history error:', error);
        res.status(StatusCodeEnum.INTERNAL_SERVER_ERROR).json({ error: 'Failed to retrieve transaction history.' });
    }
};