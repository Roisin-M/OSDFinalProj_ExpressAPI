import express, {Application, Request, Response} from "express";
import instructorRoutes from './routes/instructors';
import classLocationRoutes from './routes/classLocations';
import classRoutes from './routes/classes';
import userRoutes from './routes/users';
import authRoutes from './routes/auths';
import bookRoutes from './routes/book';
import dotenv from "dotenv";
import cors from "cors";
//import morgan from "morgan";

dotenv.config();
const PORT = process.env.PORT || 3001;
const app: Application = express();

//app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

app.get("/ping", async (_req : Request, res: Response) => {
    res.json({
    message: "running on port",
    });
});

app.use('/yoga-studio-management-api/v1/instructors',instructorRoutes)
app.use('/yoga-studio-management-api/v1/classlocations',classLocationRoutes)
app.use('/yoga-studio-management-api/v1/classes',classRoutes)
app.use('/yoga-studio-management-api/v1/users',userRoutes)
app.use('/yoga-studio-management-api/v1/auth',authRoutes)
app.use('/yoga-studio-management-api/v1/book',bookRoutes)


app.listen(PORT, () => {
    console.log("Server is running on port  --", PORT);
    });
