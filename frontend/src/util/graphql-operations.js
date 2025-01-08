export const GQL_OPS = {
  AUTH: {
    SIGNUP: {},
    LOGIN: {},
  },
  FEED: {
    GET_POSTS: {},
    CREATE_POST: {},
    EDIT_POST: {},
  },
};

GQL_OPS.AUTH.SIGNUP.getOperation = (data) => {
  const query = `
  mutation CreateUserMutation($input: CreateUserInput!) {
    createUser(userInput: $input) {
      _id
      name
      email
    }
  }`;
  return {
    query,
    variables: { input: data },
  };
};

GQL_OPS.AUTH.LOGIN.getOperation = ({ email, password }) => {
  const query = `
  query LoginUserQuery($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      userId
    }
  }
  `;
  return {
    query,
    variables: { email, password },
  };
};

GQL_OPS.FEED.GET_POSTS.getOperation = ({ page }) => {
  const query = `
  query GetPostsQuery {
    posts: getPosts {
      _id
      title
      content
      createdAt
      creator {
        name
      }
    }
    totalItems: getPostsCount
  }
  `;
  return {
    query,
    variables: { page },
  };
};

GQL_OPS.FEED.CREATE_POST.getOperation = (data) => {
  const query = `
  mutation CreatePostMutation($input: CreatePostInput!) {
    post: createPost(postInput: $input) {
      _id
      title
      content
      imageUrl
      createdAt
      creator {
        _id
        name
        email
      }
    }
  }
  `;
  return {
    query,
    variables: { input: data },
  };
};

GQL_OPS.FEED.EDIT_POST.getOperation = (data) => {
  const query = ``;
  return {
    query,
    variables: {},
  };
};
