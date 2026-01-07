import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { readFileSync } from 'fs';
import path from 'path';
import { resolvers } from './resolvers';

export async function createGraphQLServer(app: any) {
    const typeDefs = readFileSync(
        path.join(__dirname, 'schema.graphql'),
        'utf8'
    );

    const server = new ApolloServer({
        typeDefs,
        resolvers,
    });

    const { url } = await startStandaloneServer(server, { listen: { port: 4000 } });
        console.log(`GraphQL Server running at ${url}`);
}
createGraphQLServer({}).catch(console.error);
