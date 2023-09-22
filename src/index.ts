require('dotenv').config()

import express, {Request, Response} from "express"
import cors from "cors"
import initDb from "./db-connector";

initDb()

import { routes } from './routes';
import cookieParser from "cookie-parser";

const EXPRESS_PORT = process.env.PORT; 
const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
  credentials: true,
  origin: ["http://localhost:3000"]
}))

app.get('/', (req: Request, res: Response) => {
  res.send('INFO :: Root route called');
});

routes(app)

app.listen(EXPRESS_PORT, () => {
  console.log('INFO :: Webserver started on port ' + EXPRESS_PORT)
});