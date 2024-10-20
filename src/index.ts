import express, {Application, Request, Response} from "express";
import instructorRoutes from './routes/instructors';
import classLocationRoutes from './routes/classLocations';
import classRoutes from './routes/classes';
import dotenv from "dotenv";
//import morgan from "morgan";

dotenv.config();

const PORT = process.env.Port || 3001;

const app: Application = express();

app.use(express.json());

//app.use(morgan("tiny"));

app.get("/ping", async (_req : Request, res: Response) => {
    res.json({
    message: "running on port",
    });
});

app.use('/yoga-studio-management-api/v1/instructors',instructorRoutes)
app.use('/yoga-studio-management-api/v1/classlocations',classLocationRoutes)
app.use('/yoga-studio-management-api/v1/classes',classRoutes)


app.listen(PORT, () => {
    console.log("Server is running on port  --", PORT);
    });
