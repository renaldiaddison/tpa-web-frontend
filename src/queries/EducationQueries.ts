import { gql } from "@apollo/client";

export const CreateEducation = gql`
  mutation createEducation(
    $UserID: ID!
    $School: String!
    $Degree: String!
    $FieldOfStudy: String!
    $StartDate: String!
    $EndDate: String!
    $Grade: Float!
    $Activities: String!
    $Description: String!
  ) {
    createEducation(
      input: {
        UserID: $UserID
        School: $School
        Degree: $Degree
        FieldOfStudy: $FieldOfStudy
        StartDate: $StartDate
        EndDate: $EndDate
        Grade: $Grade
        Activities: $Activities
        Description: $Description
      }
    )
  }
`;

export const UpdateEducation = gql`
  mutation updateEducation(
    $id: String!
    $UserID: ID!
    $School: String!
    $Degree: String!
    $FieldOfStudy: String!
    $StartDate: String!
    $EndDate: String!
    $Grade: Float!
    $Activities: String!
    $Description: String!
  ) {
    updateEducation(
      id: $id
      input: {
        UserID: $UserID
        School: $School
        Degree: $Degree
        FieldOfStudy: $FieldOfStudy
        StartDate: $StartDate
        EndDate: $EndDate
        Grade: $Grade
        Activities: $Activities
        Description: $Description
      }
    )
  }
`;

export const GetUserEducation = gql`
  query GetUserEducation($userID: ID!) {
    userEducation(userID: $userID) {
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
  }
`;

export const DeleteEducation = gql`
  mutation DeleteEducation($id: String!) {
    deleteEducation(id: $id)
  }
`;
