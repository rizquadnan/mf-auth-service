import { Router } from 'express';
import { AuthenticatedUser, Login, Logout, Register } from './controller/auth.controller'
import { CreateProduct, GetProducts } from './controller/product.controller';
import { CheckAuthState } from './middleware/auth.middleware';
import { Hello } from './controller/hello.controller';

export const routes = (router: Router) => {
  router.post('/api/register', Register)
  router.post('/api/login', Login)

  router.get("/api/hello", Hello)

  router.get('/api/user', CheckAuthState, AuthenticatedUser)
  router.post('/api/logout', CheckAuthState, Logout)

  router.post('/api/products', CheckAuthState, CreateProduct)
  router.get('/api/products', CheckAuthState, GetProducts)
}