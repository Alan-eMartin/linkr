import { gql } from 'apollo-server';

const typeDefs = gql`
  type Query {
    hello: String
  }

  # Mutations
  type Mutation {
    signup(
      credentials: AuthInput!
      username: String!
      name: String!
      bio: String
    ): AuthPayload!
    login(credentials: AuthInput!): AuthPayload!
  }

  # Errors
  type UserError {
    message: String!
  }

  # Payloads
  type AuthPayload {
    userErrors: [UserError!]!
    token: String
  }

  # Inputs
  input AuthInput {
    email: String!
    password: String!
  }
`;

export default typeDefs;
