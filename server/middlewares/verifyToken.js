import jwt from 'jsonwebtoken';
import helpers from '../helpers';

const { identifyUserById } = helpers;

export default async (req, res, next) => {
  const token = req.headers.authorization || req.query.token;
  if (!token) {
    return res.status(401).json({
      status: 'failure',
      message: 'please provide a token'
    });
  }
  const decoded = jwt.verify(
    token,
    process.env.JWT_SECRET,
    (err, info) => {
      if (err) return err;
      return info;
    }
  );
  if (!decoded.message) {
    const { id } = decoded;
    const findAccount = await identifyUserById(id, next);
    if (typeof findAccount !== 'object') {
      return res.status(404).json({
        status: 'failure',
        message: 'account not found'
      });
    }
    req.userData = findAccount;
    return next();
  }
  if (decoded.message === 'jwt expired') {
    return res.status(401).json({
      status: 'unauthorized',
      message: 'token expired'
    });
  }
  return res.status(401).json({
    status: 'unauthorized',
    message: 'invalid token'
  });
};
