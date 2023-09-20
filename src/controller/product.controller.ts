import { Request, Response } from "express"
import { Manager } from "../db-connector"
import { Product } from "../entities/product.entity"
import { registerValidation } from "../validation/product.validation"

const repository = Manager.getRepository(Product)

export const GetProducts = async (req: Request, res: Response) => {
  const products = await repository.find()

  res.send(products)
}

export const CreateProduct = async (req: Request, res: Response) => {
  const body = req.body
  
  const { error } = registerValidation.validate(body);
  // break if something is missing
  if (error) {
    return res.status(400).send(error.details);
  }

  const product = await repository.save(req.body)

  res.status(201).send(product)
}