const baseUrl = import.meta.env.VITE_SERVER_ORIGIN;

export const ENDPOINT = {
  FEED: {
    GET_POSTS: {
      url: () => `${baseUrl}/feed/posts`,
      method: "GET",
    },
    CREATE_POST: {
      url: () => `${baseUrl}/feed/post`,
      method: "POST",
    },
  },
};
