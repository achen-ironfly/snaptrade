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

let authStore: { userId?: string; userSecret?: string } = {};

export const resolvers = {
    Mutation: {
        auth: async (_: any, { payload }: any) => {
            if (!payload || !payload.id || payload.id.trim() === "") {
                throw new Error("payload.id cannot be empty");
            }
                
            const userSecret = await registerUser(payload.id);
            if (!userSecret) {
                throw new Error("Failed to register user");
            }
                
            const url = await generateUrl(payload.id, userSecret);
            authStore = {
                userId: payload.id,
                userSecret: userSecret
            };
                
            return {
                response: url,
                identifier: null
            };
        } 
    },

    Query: {
        account: async (_: any, args: { identifier?: string }, context: Context) => {
            const userId = authStore.userId || context.userId;
            const userSecret = authStore.userSecret || context.userSecret;
            
            if (!userId || !userSecret) {
                throw new Error("userId and userSecret are required. Please authenticate first.");
            }

            const accounts = await listAccounts(userId, userSecret);
            if (!accounts || accounts.length === 0) return [];

            const targetAccount = args.identifier
                ? accounts.find((a: any) => a.id === args.identifier) ?? accounts[0]
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

        transaction: async (_: any, args: { identifier: string }, context: Context) => {
            const userId = authStore.userId || context.userId;
            const userSecret = authStore.userSecret || context.userSecret;
            
            if (!userId || !userSecret) {
                throw new Error("userId and userSecret are required. Please authenticate first.");
            }
            
            const activities = await accountActivities(
                args.identifier,
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
