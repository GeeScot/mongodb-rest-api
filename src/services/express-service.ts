import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import { expressjwt as jwt } from 'express-jwt';
import jwks from 'jwks-rsa';
import jwt_decode from 'jwt-decode';

import collectionsCrudRouter from '../api/collections-crud-router';

const log = (message: string) => {
  console.log(`[${new Date().toISOString()}] ${message}`);
}

const jwksClient = jwks.expressJwtSecret({
  cache: true,
  rateLimit: true,
  jwksRequestsPerMinute: 5,
  jwksUri: `https://${process.env.AUTH0_TENANT}/.well-known/jwks.json`
});

const jwtCheck = jwt({
  secret: jwksClient as any,
  audience: process.env.AUTH0_AUDIENCE,
  issuer: `https://${process.env.AUTH0_TENANT}/`,
  algorithms: ['RS256']
});

declare global {
  namespace Express {
    export interface Request {
      user?: any
    }
  }
}

const middleware = async (req: Request, _res: Response, next: NextFunction) => {
  if (!req.headers.authorization) {
    await next();
    return;
  }
  
  req.user = jwt_decode(req.headers.authorization);
  await next();
}

export default function createExpressService() {
  const app = express();

  const corsDomains = process.env.CORS_DOMAINS?.split(',') ?? [];
  app.use(cors({ origin: ['http://localhost:3001', ...corsDomains] }));
  app.use(express.json());
  app.use(middleware);
  app.use(jwtCheck);

  collectionsCrudRouter(app);

  const port = process.env.PORT ?? 3000;
  app.listen(port, () => {
    log(`listening on port ${port}`);
  });
}
