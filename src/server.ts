import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import projectsRoutes from "./routes/projects.route";
import Project from "./models/projects.model";
import User from "./models/users.model";
import Collaborator from "./models/collaborators.model";
import Code from "./models/code.model";
import cookieParser from "cookie-parser";

const models = { Project, User, Collaborator, Code };

const DB_HOST = process.env.DB_HOST;
const CLIENT_PORT = process.env.CLIENT_PORT;
const PORT = process.env.PORT || 5000;

Object.values(models)
  .filter((model: any) => typeof model.associate === "function")
  .forEach((model: any) => model.associate(models));

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());

app.use(
  cors({
    origin: `http://${DB_HOST}:${CLIENT_PORT}`,
    credentials: true,
  })
);

// routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectsRoutes);

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
