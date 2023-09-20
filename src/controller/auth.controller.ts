import { Request, Response } from 'express';
import bcryptjs from "bcryptjs"

import { registerValidation } from '../validation/register.validation';
import { UserRepository } from '../db-connector';
import { sign, verify } from 'jsonwebtoken';

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY as string

// REGISTER USER
export const Register = async (req: Request, res: Response) => {
  const body = req.body;

  // check if all infos were send
  const { error } = registerValidation.validate(body);
  // break if something is missing
  if (error) {
    return res.status(400).send(error.details);
  }
  // verify that password is confirmed
  if (body.password !== body.passwordConfirm) {
    return res.status(400).send({
      message: 'ERROR :: Passwords do not match!'
    });
  }
  // save password to database
  const { password, ...user } = await UserRepository.save({
    firstName: body.firstName,
    lastName: body.lastName,
    email: body.email,
    password: await bcryptjs.hash(body.password, 10)
  })

  res.send(user);
};

// LOGIN USER
export const Login = async (req: Request, res: Response) => {
  // check if user exists in db
  const user = await UserRepository.findOneBy(
    {
      email: req.body.email
    }
  )

  // if does not exists break
  if (!user) {
    return res.status(404).send({
      message: 'ERROR :: User does not exists!'
    })
  }

  // if exists but password is wrong break
  if (!await bcryptjs.compare(req.body.password, user.password)) {
    return res.status(404).send({
      message: 'ERROR :: Invalid credentials!'
    })
  }

  // don't return password after successful login
  const { password, ...data } = user;
  
  // send token via cookies
  const token = sign(
    {
      id: user.id
    }, JWT_SECRET_KEY
  )
  res.cookie("jwt", token, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 //1day
  })
  
  res.send({
    message: 'INFO :: Successfully logged in.'
  })
}

export const AuthenticatedUser = async (req: Request, res: Response) => {
  // get cookie from authenticated user
  const jwt = req.cookies?.['jwt'];

  // get user id from jwt
let payload: any;
 try {
   payload = verify(jwt, JWT_SECRET_KEY)

   if (!payload) {
     return res.status(401).send({
       message: 'ERROR :: User unauthenticated!'
     })
   }
 } catch (error) {
   return res.status(401).send({
     message: 'ERROR :: User unauthenticated!'
   })
 }
  // return user info  for user id
  const result = await UserRepository.findOneBy(payload.id)

  if (result) {
    const { password, ...user} = result
    res.send(user)
  } else {
    return res.status(404).send({
      message: 'ERROR :: User does not exists!'
    })
  }
}

export const Logout = async (req: Request, res: Response) => {
  res.cookie('jwt', '', { maxAge: 0 })

  res.send({
    message: 'INFO :: Successfully logged out.'
  })
}