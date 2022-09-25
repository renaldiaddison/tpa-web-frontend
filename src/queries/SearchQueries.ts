import { gql } from "@apollo/client";

export const querySearch = gql`
  query Search($Keyword: String!, $Limit: Int!, $Offset: Int!) {
    Search(Keyword: $Keyword, Limit: $Limit, Offset: $Offset) {
      Users {
        id
        email
        password
        is_active
        firstName
        lastName
        profile_picture
        background_picture
        about
        location
        profileLink
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
