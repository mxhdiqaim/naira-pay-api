import { Request, Response } from 'express';
import Openfort from '@openfort/openfort-node';
import {StatusCodeEnum} from "../types/enum";
import {AuthRequest, AuthResponse} from "../types";



const openForSecretKey = process.env.OPENFORT_SECRET_KEY;

if (!openForSecretKey) {
    throw new Error('OPENFORT_SECRET_KEY is not defined in environment variables');
}

// Initialise the Openfort client with the secret key
const openfort = new Openfort(openForSecretKey as string);

export const authHandler = async (req: Request, res: Response) => {
    try {
        const { token } = req.body as AuthRequest;

        if (!token) {
            return res.status(StatusCodeEnum.BAD_REQUEST).json({ error: 'Token is required.' });
        }

        // Create a Player (user) in Openfort
        const player = await openfort.players.create({
            name: 'NairaPay User',
            metadata: {
                googleId: 'google-oauth2|1234567890', // this will be replaced with actual Google user ID
                authProviderToken: token,
            },
        });

        // Creating an Embedded Wallet for the Player
        // Const wallet = await openfort.players.createEmbeddedWallet(player.id, {
        //     chainId: 80001, // Polygon Mumbai Testnet
        //     externalAuthProvider: 'google',
        //     token,
        // });

        const wallet = await openfort.accounts.create({
            player: player.id,
            chainId: 80001, // Polygon Mumbai Testnet
            // tokenId: token
        })

        const response: AuthResponse = {
            walletAddress: wallet.address,
        };
        res.status(StatusCodeEnum.OK).json(response);
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(StatusCodeEnum.INTERNAL_SERVER_ERROR).json({ error: 'Failed to authenticate and create wallet.' });
    }
};