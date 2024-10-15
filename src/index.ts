import express, {Application, Request, Response} from "express";
//import morgan from "morgan";

const PORT = process.env.Port || 3000;

const app: Application = express();

//app.use(morgan("tiny"));

app.get("/ping", async (_req : Request, res: Response) => {
    res.json({
    message: "running on port",
    });
});

app.listen(PORT, () => {
    console.log("Server is running on port  --", PORT);
    });
