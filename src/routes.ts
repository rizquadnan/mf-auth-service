import { Router } from 'express';
import { AuthenticatedUser, Login, Logout, Register } from './controller/auth.controller'
import { CreateProduct } from './controller/product.controller';
import { CheckAuthState } from './middleware/auth.middleware';

export const routes = (router: Router) => {
  router.post('/api/register', Register)
  router.post('/api/login', Login)
  router.get('/api/user', CheckAuthState, AuthenticatedUser)
  router.post('/api/logout', CheckAuthState, Logout)

  router.post('/api/products', CheckAuthState, CreateProduct)

}