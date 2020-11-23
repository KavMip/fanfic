export function extractUser(req) {
    if (!req.user) return null;
    const {
      _id, name, email, isAdmin
    } = req.user;
    return {
      _id, name, email, isAdmin
    };
  }
  