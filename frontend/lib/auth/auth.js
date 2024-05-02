import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { authConfig } from './auth.config';
import axios from 'axios';
import { endpoint } from '@/constants';

const login = async (credentials) => {
    try {
        const response = await axios.post(endpoint + '/auth/authenticate', {
            "email": credentials.email,
            "password": credentials.password
        })

        const { token } = response.data;

        const user = await fetch(endpoint + "/user", {
            headers: {
                accept: "application/json",
                Authorization: `Bearer ${token}`,
            },
        }).then((res) => res.json());
        user.token = token

        return user

    } catch (e) {
        console.log(e.message)
    }

};

export const {
    handlers: { POST },
    auth,
    signIn,
    signOut
} = NextAuth({
    ...authConfig,
    providers: [
        CredentialsProvider({
            async authorize(credentials, request) {
                try {
                    const user = await login(credentials);
                    return user;
                } catch (err) {
                    return null;
                }
            },
        }),
    ],
    callbacks: {
        ...authConfig.callbacks,
    }
})