import {
  registerUser,
  generateUrl,
  connect,
  listAccounts,
  accountActivities,
  normalizeAccounts,
  normalizeTransactions,
  accountBalances,
} from '../src/snaptrade';

interface Context {
  userId?: string;
  userSecret?: string;
}

export const resolvers = {
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

    Query: {
        Account: async (_: any, args: { id?: string }, context: Context) => {
        const { userId, userSecret } = context;
        if (!userId || !userSecret) {
            throw new Error("userId and userSecret are required in context");
        }

        const accounts = await listAccounts(userId, userSecret);
        if (!accounts || accounts.length === 0) return null;

        const targetAccount = args.id
            ? accounts.find((a: any) => a.id === args.id) ?? accounts[0]
            : accounts[0];
        const balances = await accountBalances(targetAccount.id, userId, userSecret);
        const normalized = normalizeAccounts([targetAccount], balances);

        return [
            {
                id: normalized[0].id,
                name: normalized[0].name,
                currency: normalized[0].currency,
                balance: normalized[0].balance,
            }
        ];
    },

        Transaction: async (_: any, args: { id: string },context: Context) => {
        const { userId, userSecret } = context;
        if (!userId || !userSecret) {
            throw new Error("userId and userSecret are required in context");
        }
        const activities = await accountActivities(
            args.id,
            userId,
            userSecret
        );
        const transactions = normalizeTransactions(activities?.data || []);

        return transactions.map((tx: any) => ({
            transactionId: tx.transactionId,
            transactionTime: tx.transactionTime,
            amount: tx.amount,
            currency: tx.currency,
            description: tx.description,
            status: tx.status,
            balance: tx.balance,
        }));
        },
    },
};
