import { Request, Response } from 'express';
import openfort from '../config/openfort-client';
import { StatusCodeEnum } from "../types/enum";
import { AuthRequest } from "../types";
import { getEnvVariable } from "../utils";

const chainId = parseInt(getEnvVariable('CHAIN_ID'));

const apiKey = getEnvVariable('OPENFORT_SECRET_KEY');
const baseUrl = getEnvVariable('OPENFORT_BASEURL');

export const authHandler = async (req: Request, res: Response) => {
    try {
        const { token } = req.body as AuthRequest;

        if (!token) {
            return res.status(StatusCodeEnum.BAD_REQUEST).json({ error: 'Token is required.' });
        }

        // Make direct API call to avoid serialisation issues
        const response = await fetch(`${baseUrl}/iam/v1/oauth/verify`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                provider: "google",
                token: token,
                tokenType: "idToken"
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('API Error:', errorText);

            throw new Error(`API call failed: ${response.status}`);
        }

        const newPlayer = await response.json();

        // // Create the request object manually to avoid union type serialization issues
        // const authRequest = {
        //     provider: "google", // Direct string value
        //     token: token,
        //     tokenType: "idToken"
        // };
        //
        // // Verify the OAuth token to get or create a player.
        // const newPlayer = await openfort.iam.verifyOAuthToken(authRequest as any);


        // Create a Player (user record)
        // const newPlayer = await openfort.players.create({
        //     name: "NairaPay User",
        // });

        // Check if the player already has an account.
        if (newPlayer.accounts && newPlayer.accounts.length > 0) {
            const account = newPlayer.accounts[0];
            const response = {
                walletAddress: account.address,
                playerId: newPlayer.id,
                message: "Account already exists."
            };

            return res.status(StatusCodeEnum.OK).json(response);
        }


        // Create an Account (wallet) and link it to the Player AND the social token
        const newAccount = await openfort.accounts.create({
            player: newPlayer.id,
            chainId,
        });

        // The response the frontend expects
        const responseObj = {
            walletAddress: newAccount.address,
            playerId: newPlayer.id,
            message: "New wallet created."
            // Include other player details here
        };

        res.status(StatusCodeEnum.OK).json(responseObj);

    } catch (error) {
        console.error('Authentication error:', error);
        res.status(StatusCodeEnum.INTERNAL_SERVER_ERROR).json({ error: 'Failed to authenticate and create wallet.' });
    }
};