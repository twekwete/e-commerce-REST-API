export const checkIfAuthorized = (req, res, next) => {
  if (!req.session?.passport?.user) {
    return res.status(401).send("Unauthorized: User not logged in.");
  }
  next();
};
