import { gql } from "@apollo/client";

export const Posts = gql`
  query Posts($Limit: Int!, $Offset: Int!) {
    Posts(Limit: $Limit, Offset: $Offset) {
      id
      text
      videoUrl
      photoUrl
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
`;

export const CreatePost = gql`
  mutation CreatePost(
    $senderId: ID!
    $text: String!
    $photoUrl: String!
    $videoUrl: String!
  ) {
    CreatePost(
      input: {
        senderId: $senderId
        text: $text
        photoUrl: $photoUrl
        videoUrl: $videoUrl
      }
    ) {
      id
      text
      videoUrl
      photoUrl
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
`;

export const LikePost = gql`
  mutation LikePost($postId: ID!, $userId: ID!) {
    LikePost(postId: $postId, userId: $userId) {
      postId
      userId
    }
  }
`;

export const UnLikePost = gql`
  mutation UnLikePost($postId: ID!, $userId: ID!) {
    UnLikePost(postId: $postId, userId: $userId) {
      postId
      userId
    }
  }
`;

export const CommentPost = gql`
  query postComments($Limit: Int!, $Offset: Int!, $postId: ID!) {
    postComments(Limit: $Limit, Offset: $Offset, postId: $postId) {
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
`;

export const RepliedToComments = gql`
  query repliedToComments($Limit: Int!, $Offset: Int!, $commentId: ID!) {
    repliedToComments(Limit: $Limit, Offset: $Offset, commentId: $commentId) {
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
`;

export const PostComments = gql`
  query postComment($id: ID!) {
    postComment(id: $id) {
      id
      postId
      Commenter {
        id
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
`;

export const AddComment = gql`
  mutation addComment($postId: ID!, $commenterId: ID!, $comment: String!) {
    addComment(postId: $postId, commenterId: $commenterId, comment: $comment) {
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
`;

export const AddLikeComment = gql`
  mutation addLikeComment($commentId: ID!, $userId: ID!) {
    addLikeComment(commentId: $commentId, userId: $userId) {
      id
      commentId
      User {
        id
        firstName
        lastName
      }
    }
  }
`;

export const DeleteLikeComment = gql`
  mutation deleteLikeComment($commentId: ID!, $userId: ID!) {
    deleteLikeComment(commentId: $commentId, userId: $userId) {
      id
      commentId
      User {
        id
        firstName
        lastName
      }
    }
  }
`;

export const AddReply = gql`
  mutation addReply(
    $postId: ID!
    $commenterId: ID!
    $replyToCommentId: ID!
    $comment: String!
  ) {
    addReply(
      postId: $postId
      commenterId: $commenterId
      replyToCommentId: $replyToCommentId
      comment: $comment
    ) {
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
`;
