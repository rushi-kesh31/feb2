const jwt = require('jsonwebtoken');
const secretKey  = "superS3cr3t1";
const { Request, Response, NextFunction } = require('express');

const authenticateJwt = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      jwt.verify(token, secretKey, (err, user) => {
        if (err) {
          return res.sendStatus(403);
        }
        if (!user) {
          res.sendStatus(403);
        }
        if (typeof user === 'string') {
          res.sendStatus(403);
        }
        req.user = user;
        next();
      });
    } else {
      res.sendStatus(401);
    }
};

module.exports = {authenticateJwt, secretKey};
