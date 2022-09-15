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
    getAllUsers {
      id
    }
  }
`;

export const GetUserById = gql`
  query GetUserById($id: ID!) {
    getUserById(id: $id) {
      id
      email
      firstName
      lastName
      additionalName
      is_active
      profile_picture
      background_picture
      headline
      about
      location
      profile_views
      followed_user
      connected_user
      request_connect
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
`;

export const UpdateBackgroundPicture = gql`
  mutation UpdateBackgroundPicture($id: ID!, $imageUrl: String!) {
    updateBackgroundPicture(id: $id, imageUrl: $imageUrl)
  }
`;

export const RequestConnect = gql`
  mutation RequestConnect($id: String!, $recipientID: String!) {
    requestConnect(id: $id, recipientID: $recipientID)
  }
`;

export const AcceptConnect = gql`
  mutation AcceptConnect($id: String!, $senderID: String!) {
    acceptConnect(id: $id, senderID: $senderID)
  }
`;

export const Follow = gql`
  mutation Follow($id: String!, $followedID: String!) {
    follow(id: $id, followedID: $followedID)
  }
`;

export const Unfollow = gql`
  mutation Unfollow($id: String!, $unfollowedID: String!) {
    unfollow(id: $id, unfollowedID: $unfollowedID)
  }
`;

export const IgnoreConnect = gql`
  mutation IgnoreConnect($id: String!, $senderID: String!) {
    ignoreConnect(id: $id, senderID: $senderID)
  }
`;
