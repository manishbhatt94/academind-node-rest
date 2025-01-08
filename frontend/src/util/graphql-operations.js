export const GQL_OPS = {
  AUTH: {
    SIGNUP: {},
    LOGIN: {},
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
