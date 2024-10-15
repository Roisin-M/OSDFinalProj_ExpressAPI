import express, {Application, Request, Response} from "express";
import instructorRoutes from './routes/instructors';
//import morgan from "morgan";

const PORT = process.env.Port || 3000;

const app: Application = express();

//app.use(morgan("tiny"));

app.get("/ping", async (_req : Request, res: Response) => {
    res.json({
    message: "running on port",
    });
});

app.use('/yoga-studio-management-api/v1/instructors',instructorRoutes)

app.listen(PORT, () => {
    console.log("Server is running on port  --", PORT);
    });
