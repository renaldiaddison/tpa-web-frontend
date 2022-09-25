import { gql } from "@apollo/client";

export const AddNotification = gql`
  mutation AddNotification(
    $toUserId: ID!
    $fromUserId: ID!
    $message: String!
  ) {
    addNotification(
      toUserId: $toUserId
      fromUserId: $fromUserId
      message: $message
    ) {
      id
      message
      fromUser {
        id
        firstName
        lastName
        profile_picture
      }
      toUser {
        id
        firstName
        lastName
        profile_picture
      }
    }
  }
`;

export const Notifications = gql`
  query Notifications($toUserId: ID!) {
    userNotification(toUserId: $toUserId) {
      id
      message
      fromUser {
        id
        firstName
        lastName
        profileImageUrl
      }
    }
  }
`;
