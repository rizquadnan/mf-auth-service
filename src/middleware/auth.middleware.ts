import { Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

import { Manager } from '../db-connector';
import { User } from '../entities/user.entity';
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY as string

const repository = Manager.getRepository(User)

export const CheckAuthState = async (req: Request, res: Response, next: Function) => {
  try {
    // get cookie from authenticated user
    const jwt = req.cookies?.['jwt'];
    // get user id from jwt
    const payload: any = verify(jwt, JWT_SECRET_KEY)

    if (!payload) {
      return res.status(401).send({
        message: 'ERROR :: User unauthenticated!'
      })
    }
    // return user info  for user id
    // @ts-ignore
    req['user'] = await repository.findOneBy(payload.id)

    next();
  } catch (e) {
    return res.status(401).send({
      message: 'ERROR :: User unauthenticated!'
    })
  }
}