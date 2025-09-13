import { Request, Response } from 'express';
import openfort from '../config/openfort-client';
import { StatusCodeEnum } from "../types/enum";
import { AuthRequest } from "../types";
import { getEnvVariable } from "../utils";

const chainId = parseInt(getEnvVariable('CHAIN_ID'));

export const authHandler = async (req: Request, res: Response) => {
    try {
        const { token } = req.body as AuthRequest;

        if (!token) {
            return res.status(StatusCodeEnum.BAD_REQUEST).json({ error: 'Token is required.' });
        }

        // Create a Player (user record)
        const player = await openfort.players.create({
            name: "NairaPay User"
        });

        // Create an Account (wallet) and link it to the Player AND the social token
        const account = await openfort.accounts.create({
            player: player.id,
            chainId,
            // externalAuthProvider: {
            //     google: {
            //         token
            //     }
            // }
        });

        // The response the frontend expects
        const response = {
            walletAddress: account.address,
            playerId: player.id
            // Include other player details here
        };

        res.status(StatusCodeEnum.OK).json(response);

    } catch (error) {
        console.error('Authentication error:', error);
        res.status(StatusCodeEnum.INTERNAL_SERVER_ERROR).json({ error: 'Failed to authenticate and create wallet.' });
    }
};