import express, {Application, Request, Response} from "express";

const PORT = process.env.Port || 3000;

const app: Application = express();

app.get("/ping", async (_req : Request, res: Response) => {
    res.json({
    message: "running on port",
    });
});

app.listen(PORT, () => {
    console.log("Server is running on port  --", PORT);
    });
