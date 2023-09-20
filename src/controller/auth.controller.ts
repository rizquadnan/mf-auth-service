import { Request, Response } from 'express';
import bcryptjs from "bcryptjs"

import { registerValidation } from '../validation/register.validation';
import { sign, verify } from 'jsonwebtoken';
import { User } from '../entities/user.entity';
import { Manager } from '../db-connector';

const repository = Manager.getRepository(User)

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
  const { password, ...user } = await repository.save({
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
  const user = await repository.findOneBy(
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
  // @ts-ignore
  const { password, ...user } = req['user']
  res.send(user);
}

export const Logout = async (req: Request, res: Response) => {
  res.cookie('jwt', '', { maxAge: 0 })

  res.send({
    message: 'INFO :: Successfully logged out.'
  })
}