import { gql } from "@apollo/client";

export const Search = gql`
  query Search($Keyword: String!) {
    Search(Keyword: $Keyword) {
      Users {
        id
        email
        is_active
        firstName
        lastName
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
      Posts {
        id
        text
        photoUrl
        videoUrl
        Sender {
          id
          firstName
          lastName
          profile_picture
          Follows {
            userId
            followId
          }
        }
      }
    }
  }
`;

export const SearchHashtag = gql`
  query SearchHashtag($Keyword: String!, $Limit: Int!, $Offset: Int!) {
    SearchHashtag(Keyword: $Keyword, Limit: $Limit, Offset: $Offset) {
      Posts {
        id
        text
        photoUrl
        videoUrl
        Sender {
          id
          firstName
          lastName
          profile_picture
          Follows {
            userId
            followId
          }
        }
      }
    }
  }
`;

export const SearchUser = gql`
  query SearchUser($Keyword: String!, $Limit: Int!, $Offset: Int!) {
    SearchUser(Keyword: $Keyword, Limit: $Limit, Offset: $Offset) {
      Users {
        id
        email
        is_active
        firstName
        lastName
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
  }
`;

export const SearchPost = gql`
  query SearchPost($Keyword: String!, $Limit: Int!, $Offset: Int!) {
    SearchPost(Keyword: $Keyword, Limit: $Limit, Offset: $Offset) {
      Posts {
        id
        text
        photoUrl
        videoUrl
        Sender {
          id
          firstName
          lastName
          profile_picture
          Follows {
            userId
            followId
          }
        }
        Likes {
          userId
          postId
        }
        Comments {
          id
          postId
          Commenter {
            firstName
            lastName
            profile_picture
          }
          comment
          Likes {
            id
            commentId
            User {
              id
              firstName
              lastName
            }
          }
          Replies {
            id
          }
        }
      }
    }
  }
`;
