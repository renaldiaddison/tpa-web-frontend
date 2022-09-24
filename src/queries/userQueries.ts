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
      about
      location
      Educations {
        ID
        UserID
        School
        Degree
        FieldOfStudy
        StartDate
        EndDate
        Grade
        Activities
        Description
      }
      Experiences {
        ID
        UserID
        Title
        EmploymentType
        CompanyName
        Location
        Active
        StartYear
        EndYear
        Industry
        Description
      }
      Visits {
        userId
        visitId
      }
      Follows {
        userId
        followId
      }
      Connection {
        id
        user1 {
          id
          firstName
          lastName
          email
          profile_picture
        }
        user2 {
          id
          firstName
          lastName
          email
          profile_picture
        }
      }
      ConnectRequest {
        id
        fromUser {
          id
          firstName
          lastName
          email
          profile_picture
        }
        toUser {
          id
          firstName
          lastName
          email
          profile_picture
        }
      }
      Block {
        userId
        blockId
      }
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

export const FollowUser = gql`
  mutation FollowUser($id1: ID!, $id2: ID!) {
    followUser(id1: $id1, id2: $id2)
  }
`;

export const UnFollowUser = gql`
  mutation UnFollowUser($id1: ID!, $id2: ID!) {
    unFollowUser(id1: $id1, id2: $id2)
  }
`;

export const VisitUser = gql`
  mutation VisitUser($id1: ID!, $id2: ID!) {
    visitUser(id1: $id1, id2: $id2)
  }
`;

export const AddConnect = gql`
  mutation AddConnection($user1ID: ID!, $user2ID: ID!) {
    addConnection(user1ID: $user1ID, user2ID: $user2ID) {
      id
      user1 {
        id
        firstName
        lastName
      }
      user2 {
        id
        firstName
        lastName
      }
    }
  }
`;

export const AddConnectRequest = gql`
  mutation AddConnectRequest($fromUserId: ID!, $toUserId: ID!) {
    addConnectRequest(fromUserId: $fromUserId, toUserId: $toUserId) {
      id
      fromUser {
        id
        email
      }
      toUser {
        id
        email
      }
    }
  }
`;

export const DeleteConnectRequest = gql`
  mutation DeleteConnectRequest($fromUserId: ID!, $toUserId: ID!) {
    deleteConnectRequest(fromUserId: $fromUserId, toUserId: $toUserId) {
      id
      fromUser {
        id
        email
      }
      toUser {
        id
        email
      }
    }
  }
`;

export const AddBlock = gql`
  mutation AddBlock($userId: ID!, $blockId: ID!) {
    addBlock(userId: $userId, blockId: $blockId) {
      userId
      blockId
    }
  }
`;

export const DeleteBlock = gql`
  mutation DeleteBlock($userId: ID!, $blockId: ID!) {
    deleteBlock(userId: $userId, blockId: $blockId) {
      userId
      blockId
    }
  }
`;

export const UserSuggestion = gql`
  query UserSuggestion($userId: ID!) {
    UserSuggestion(userId: $userId) {
      id
      firstName
      lastName
      about
      location
      additionalName
      profile_picture
    }
  }
`;

export const UpdateUser = gql`
  mutation UpdateUser(
    $id: ID!
    $firstName: String!
    $lastName: String!
    $additionalName: String!
    $about: String!
    $location: String!
  ) {
    updateUser(
      id: $id
      input: {
        firstName: $firstName
        lastName: $lastName
        additionalName: $additionalName
        about: $about
        location: $location
      }
    ) {
      id
      firstName
      lastName
      additionalName
      about
      location
    }
  }
`;
