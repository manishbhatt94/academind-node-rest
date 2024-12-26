exports.getPosts = (req, res, next) => {
  res.status(200).json({
    posts: [
      {
        _id: '1',
        title: 'First Post',
        content: 'This is the first post!',
        imageUrl: 'images/1734945552293-134053327-cats-02.jpg',
        createdAt: new Date(),
        creator: {
          name: 'Kendrick Lamar',
        },
      },
    ],
  });
};

exports.createPost = (req, res, next) => {
  const { title, content } = req.body;
  // Create post in db
  res.status(201).json({
    message: 'Post created successfully!',
    post: { _id: new Date().toISOString(), title, content },
  });
};
