import { Request, Response } from 'express';
import Openfort from '@openfort/openfort-node';

interface AuthRequest {
    token: string;
}

interface AuthResponse {
    walletAddress: string;
}

// Initialize the Openfort client with your secret key
const openfort = new Openfort(process.env.OPENFORT_SECRET_KEY as string);

export const authHandler = async (req: Request, res: Response) => {
    try {
        const { token } = req.body as AuthRequest;

        if (!token) {
            return res.status(400).json({ error: 'Token is required.' });
        }

        // Step 1: Create a Player (user) in Openfort
        // This is a logical step to link a user account to a wallet
        const player = await openfort.players.create({
            name: 'NairaPay User',
            metadata: {
                // You can add user-specific metadata here, like their social ID
                authProviderToken: token,
            },
        });

        // Step 2: Create an Embedded Wallet for the Player
        // NOTE: This function may need to be called client-side depending on the SDK.
        // However, for a backend-driven flow, this is the expected call.
        // const wallet = await openfort.players.createEmbeddedWallet(player.id, {
        const wallet = await openfort.players.createEmbeddedWallet(player.id, {
            chainId: 80001, // Polygon Mumbai Testnet
            externalAuthProvider: 'google',
            token,
        });

        const response: AuthResponse = {
            walletAddress: wallet.address,
        };
        res.status(200).json(response);
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(500).json({ error: 'Failed to authenticate and create wallet.' });
    }
};