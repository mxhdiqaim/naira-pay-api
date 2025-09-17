import { Request, Response } from 'express';
import openfort from '../config/openfort-client';
import { StatusCodeEnum } from '../types/enum';
import { AuthRequest } from '../types';
import { getEnvVariable } from '../utils';

const chainId = parseInt(getEnvVariable('CHAIN_ID'));

export const recoverAccountHandler = async (req: Request, res: Response) => {
    try {
        const { token } = req.body as AuthRequest;

        if (!token) {
            return res.status(StatusCodeEnum.BAD_REQUEST).json({ error: 'Token is required.' });
        }

        // Use the social token to find or create the player
        const player = await openfort.players.create({
            name: 'NairaPay User',
            // externalAuthProvider: {
            //     google: { token }
            // }
        });

        // The Openfort API returns a list of accounts (wallets) linked to the player.
        if (player.accounts && player.accounts.length > 0) {
            const account = player.accounts[0];

            const response = {
                walletAddress: account.address,
                playerId: player.id,
                message: "Account recovered successfully."
            };

            res.status(StatusCodeEnum.OK).json(response);
        } else {
            // If the player was newly created and has no linked accounts
            // Create a new Account (wallet) and link it to the existing Player
            const newAccount = await openfort.accounts.create({
                player: player.id,
                chainId,
                // externalAuthProvider: {
                //     google: { token }
                // }
            });

            const response = {
                walletAddress: newAccount.address,
                playerId: player.id,
                message: "New wallet created and linked to existing player."
            };

            res.status(StatusCodeEnum.OK).json(response);
        }

    } catch (error) {
        console.error('Account recovery error:', error);
        res.status(StatusCodeEnum.INTERNAL_SERVER_ERROR).json({ error: 'Failed to recover account.' });
    }
};