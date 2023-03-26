exports.allAccess = (req, res) => {
  res.status(200).json({
    publicContent: true,
  });
};

exports.userBoard = (req, res) => {
  res.status(200).json({
    level: "User Content.",
    userID: req.userId,
  });
};

exports.adminBoard = (req, res) => {
  res.status(200).json({
    level: "Admin Content.",
    userID: req.userId,
  });
};

exports.moderatorBoard = (req, res) => {
  res.status(200).json({
    level: "Moderator Content.",
    userID: req.userId,
  });
};

//
