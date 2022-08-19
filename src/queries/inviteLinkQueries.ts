import { gql } from "@apollo/client";

export const GetLink = gql`
  query GetLink($id: String!) {
    getLink(id: $id) {
      id
      userId
    }
  }
`;

export const CreateActivationLink = gql`
  mutation CreateActivationLink($userId: String!) {
    createActivationLink(userId: $userId)
  }
`;
