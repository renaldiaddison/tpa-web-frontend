import { gql } from "@apollo/client";

export const Register = gql`
  mutation Register(
    $email: String!
    $firstName: String!
    $lastName: String!
    $password: String!
  ) {
    register(
      input: {
        email: $email
        firstName: $firstName
        lastName: $lastName
        password: $password
      }
    )
  }
`;

export const Login = gql`
  mutation Login($email: String!, $password: String!) {
    login(input: { email: $email, password: $password })
  }
`;

export const ActivateAccount = gql`
  mutation ActivateAccount($id: ID!) {
    activateUser(id: $id)
  }
`;

export const GetAllUsers = gql`
  query GetAllUsers {
    users {
      id
    }
  }
`;

export const ResetPassword = gql`
  mutation ResetPassword($email: String!, $newPassword: String!) {
    resetPassword(email: $email, newPassword: $newPassword)
  }
`;

export const UpdateProfilePicture = gql`
  mutation UpdateProfilePicture($id: ID!, $imageUrl: String!) {
    updateProfilePicture(id: $id, imageUrl: $imageUrl)
}
`