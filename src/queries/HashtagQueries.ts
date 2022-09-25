import { gql } from "@apollo/client";

export const Hashtags = gql`
  query hashtags {
    Hashtags {
      id
      hashtag
    }
  }
`;

export const AddHashtag = gql`
  mutation addHashtags($hashtag: String!) {
    addHashtag(hashtag: $hashtag) {
      id
      hashtag
    }
  }
`;
