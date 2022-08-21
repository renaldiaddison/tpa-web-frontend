import { gql } from "@apollo/client";

export const CreateAndSendResetLink = gql`
  mutation CreateAndSendResetLink($email: String!) {
    createAndSendResetLink(email: $email)
  }
`;

export const GetResetLink = gql`
  query GetResetLink($id: String!) {
    getResetLink(id: $id) {
      id
      email
    }
  }
`;
