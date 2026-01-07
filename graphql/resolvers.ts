import { getApiStatus, listAccounts, accountBalances, accountActivities, registerUser, generateUrl, connect } from '../src/snaptrade'; // Adjust the import path based on your project structure
import { normalizeAccounts, normalizeBalances, normalizeTransactions } from '../src/snaptrade'; 

export const resolvers = {
    Query: {
        apiStatus: async () => {
            try {
                const data = await getApiStatus();
                return data;
            } catch (error: any) {
                throw new Error(`Failed to get API status: ${error.message}`);
            }
        },

        accounts: async (_: any, { userId, userSecret }: any) => {
            try {
                const accounts = await listAccounts(userId, userSecret);
                return normalizeAccounts(accounts);
            } catch (error: any) {
                throw new Error(`Failed to fetch accounts: ${error.message}`);
            }
        },

        accountBalances: async (_: any, { accountId, userId, userSecret }: any) => {
            try {
                const balances = await accountBalances(accountId, userId, userSecret);
                return normalizeBalances(balances);
            } catch (error: any) {
                throw new Error(`Failed to fetch balances: ${error.message}`);
            }
        },

        accountActivities: async (_: any, { accountId, userId, userSecret }: any) => {
            try {
                const activities = await accountActivities(accountId, userId, userSecret);
                const transactionsData = activities?.data || [];
                return normalizeTransactions(transactionsData);
            } catch (error: any) {
                throw new Error(`Failed to fetch activities: ${error.message}`);
            }
        },
    },

    Mutation: {
        registerUser: async (_: any, { userId }: any) => {
            try {
                if (!userId || userId.trim() === "") {
                    throw new Error("userId cannot be empty");
                }
                const userSecret = await registerUser(userId);
                return {
                    userSecret,
                    message: "User registered successfully"
                };
            } catch (error: any) {
                throw new Error(`Registration failed: ${error.message}`);
            }
        },

        generateConnectionUrl: async (_: any, { userId, userSecret }: any) => {
            try {
                if (!userId || !userSecret) {
                    throw new Error("userId and userSecret are required");
                }
                const redirectURI = await generateUrl(userId, userSecret);
                return redirectURI;
            } catch (error: any) {
                throw new Error(`Failed to generate connection URL: ${error.message}`);
            }
        },

        connectAccount: async (_: any, { redirectURI }: any) => {
            try {
                if (!redirectURI) {
                    throw new Error("redirectURI is required");
                }
                await connect(redirectURI);
                return true;
            } catch (error: any) {
                console.error("Connection error:", error);
                throw new Error(`Connection failed: ${error.message}`);
            }
        },
    },
};