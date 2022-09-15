import { gql } from "@apollo/client";

export const CreateExperience = gql`
  mutation CreateExperience(
    $UserID: String!
    $Title: String!
    $EmploymentType: String!
    $CompanyName: String!
    $Location: String!
    $Active: Boolean!
    $StartYear: String!
    $EndYear: String!
    $Industry: String!
    $Description: String!
  ) {
    createExperience(
      input: {
        UserID: $UserID
        Title: $Title
        EmploymentType: $EmploymentType
        CompanyName: $CompanyName
        Location: $Location
        Active: $Active
        StartYear: $StartYear
        EndYear: $EndYear
        Industry: $Industry
        Description: $Description
      }
    )
  }
`;

export const GetUserExperience = gql`
  query GetUserExperience($userID: ID!) {
    userExperience(userID: $userID) {
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
  }
`;

export const DeleteExperience = gql`
  mutation DeleteExperience($id: ID!) {
    deleteExperience(id: $id)
  }
`;

export const UpdateExperience = gql`
  mutation UpdateExperience(
    $id: ID!
    $UserID: String!
    $Title: String!
    $EmploymentType: String!
    $CompanyName: String!
    $Location: String!
    $Active: Boolean!
    $StartYear: String!
    $EndYear: String!
    $Industry: String!
    $Description: String!
  ) {
    updateExperience(
      id: $id
      input: {
        UserID: $UserID
        Title: $Title
        EmploymentType: $EmploymentType
        CompanyName: $CompanyName
        Location: $Location
        Active: $Active
        StartYear: $StartYear
        EndYear: $EndYear
        Industry: $Industry
        Description: $Description
      }
    )
  }
`;
