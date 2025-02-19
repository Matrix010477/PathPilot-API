const { gql } = require('apollo-server-express');

// Define GraphQL Schema
const typeDefs = gql`
  type CareerPrediction {
    career: String
  }

  type Query {
    test: String
  }

  type Mutation {
    predictCareer(skills: [String], interests: [String]): CareerPrediction
  }
`;

const resolvers = {
  Query: {
    test: () => "GraphQL is working!",
  },
  Mutation: {
    predictCareer: (_, { skills, interests }) => {
      if (skills.includes("JavaScript") && interests.includes("Tech")) {
        return { career: "Software Developer" };
      }
      return { career: "Unknown Career" };
    },
  },
};

module.exports = { typeDefs, resolvers };
