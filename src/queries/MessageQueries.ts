import { gql } from "@apollo/client";

export const Rooms = gql`
  query rooms($userId: ID!) {
    rooms(userId: $userId) {
      id
      user1 {
        id
        firstName
        lastName
        profile_picture
      }
      user2 {
        id
        firstName
        lastName
        profile_picture
      }
      lastMessage {
        id
        sender {
          id
          firstName
          lastName
          profile_picture
        }
        text
        imageUrl
      }
    }
  }
`;

export const Room = gql`
query room($roomId: ID!) {
    room(roomId: $roomId) {
      id
      user1 {
        id
        firstName
        lastName
        profile_picture
      }
      user2 {
        id
        firstName
        lastName
        profile_picture
      }
      lastMessage {
        id
        sender {
          id
          firstName
          lastName
          profile_picture
        }
        text
        imageUrl
      }
      messages {
        id
        text
        imageUrl
        sender {
          id
          firstName
          lastName
          profile_picture
        }
        
      }
    }
  }
`;

export const AddMessage = gql`
  mutation addMessage(
    $senderId: ID!
    $text: String!
    $imageUrl: String!
    $roomId: ID!
  ) {
    addMessage(
      senderId: $senderId
      text: $text
      imageUrl: $imageUrl
      roomId: $roomId
    ) {
      id
      sender {
        id
        firstName
        lastName
        profile_picture
      }
      text
      imageUrl
      createdAt
    }
  }
`;
export const AddRoom = gql`
  mutation addRoom($userId1: ID!, $userId2: ID!) {
    addRoom(userId1: $userId1, userId2: $userId2) {
      id
      user1 {
        id
      }
      user2 {
        id
      }
      lastMessage {
        id
        text
        imageUrl
      }
      messages {
        id
        text
        imageUrl
      }
    }
  }
`;

export const AddMessageSharePost = gql`
  mutation addMessageSharePost(
    $senderId: ID!
    $roomId: ID!
    $SharePostId: ID!
  ) {
    addMessageSharePost(
      senderId: $senderId
      roomId: $roomId
      SharePostId: $SharePostId
    ) {
      id
    }
  }
`;

export const AddMessageShareProfile = gql`
  mutation addMessageShareProfile(
    $senderId: ID!
    $roomId: ID!
    $ShareProfileId: ID!
  ) {
    addMessageShareProfile(
      senderId: $senderId
      roomId: $roomId
      ShareProfileId: $ShareProfileId
    ) {
      id
    }
  }
`;
