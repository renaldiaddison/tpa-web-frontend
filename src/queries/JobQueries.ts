import { gql } from "@apollo/client";

export const AddJobs = gql`
  mutation addjob(
    $title: String!
    $companyName: String!
    $workplace: String!
    $city: String!
    $country: String!
    $employmentType: String!
    $description: String!
  ) {
    addJob(
      title: $title
      companyName: $companyName
      workplace: $workplace
      city: $city
      country: $country
      employmentType: $employmentType
      description: $description
    ) {
      id
      title
      companyName
      workplace
      city
      country
      employmentType
      description
    }
  }
`;

export const Jobs = gql`
  query jobs {
    Jobs {
      id
      title
      companyName
      workplace
      city
      country
      employmentType
      description
    }
  }
`;
