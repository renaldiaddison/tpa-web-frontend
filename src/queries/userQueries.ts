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
          headline
          firstName
          lastName
          email
          profile_picture
        }
        user2 {
          id
          headline
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
          headline
          firstName
          lastName
          email
          profile_picture
        }
        toUser {
          id
          headline
          firstName
          lastName
          email
          profile_picture
        }
        message
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

export const VisitUser = gql`
  mutation VisitUser($id1: ID!, $id2: ID!) {
    VisitUser(id1: $id1, id2: $id2)
  }
`;

export const AddConnect = gql`
  mutation addConnection($user1ID: ID!, $user2ID: ID!) {
    addConnection(user1ID: $user1ID, user2ID: $user2ID) {
      id
      user1 {
        id
        firstName
        lastName
        headline
      }
      user2 {
        id
        firstName
        lastName
        headline
      }
    }
  }
`;

export const AddConnectRequest = gql`
  mutation addConnectRequest(
    $fromUserId: ID!
    $toUserId: ID!
    $message: String!
  ) {
    addConnectRequest(
      fromUserId: $fromUserId
      toUserId: $toUserId
      message: $message
    ) {
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

export const DeleteConnectRequest = gql `
    mutation deleteConnectRequest($fromUserId:ID! , $toUserId:ID!) {
        deleteConnectRequest(fromUserId:$fromUserId , toUserId:$toUserId){
            id
            fromUser{
                id
                email
                password
            }
            toUser{
                id
                email
                password
            }
        }
    }
`

export const AddBlock = gql`
  mutation addBlock($userId: ID!, $blockId: ID!) {
    addBlock(userId: $userId, blockId: $blockId) {
      userId
      blockId
    }
  }
`;

export const UserSuggestion = gql`
    query UserSuggestion($userId:ID!){
    UserSuggestion(userId:$userId){
        id
        firstName
        lastName
        headline
        location
        profile_picture
    }
}
`


