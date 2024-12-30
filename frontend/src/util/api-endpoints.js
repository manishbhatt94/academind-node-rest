export const apiBaseUrl = import.meta.env.VITE_SERVER_ORIGIN;

export const imageBaseUrl = apiBaseUrl;

export const ENDPOINT = {
  AUTH: {
    SIGNUP: {
      url: () => `${apiBaseUrl}/auth/signup`,
      method: "PUT",
    },
    LOGIN: {
      url: () => `${apiBaseUrl}/auth/login`,
      method: "POST",
    },
  },
  FEED: {
    GET_POSTS: {
      url: () => `${apiBaseUrl}/feed/posts`,
      method: "GET",
    },
    GET_POST_DETAILS: {
      url: (postId) => `${apiBaseUrl}/feed/post/${postId}`,
      method: "GET",
    },
    CREATE_POST: {
      url: () => `${apiBaseUrl}/feed/post`,
      method: "POST",
    },
    EDIT_POST: {
      url: (postId) => `${apiBaseUrl}/feed/post/${postId}`,
      method: "PUT",
    },
    DELETE_POST: {
      url: (postId) => `${apiBaseUrl}/feed/post/${postId}`,
      method: "DELETE",
    },
    GET_STATUS: {
      url: () => `${apiBaseUrl}/feed/status`,
      method: "GET",
    },
    UPDATE_STATUS: {
      url: () => `${apiBaseUrl}/feed/status`,
      method: "PUT",
    },
  },
};
