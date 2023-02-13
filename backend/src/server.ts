import express, { Application } from "express";
import userRoute from './routes/userRoute';
class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.mountRoutes();
  }

  private mountRoutes(): void {
    const router = express.Router();

    this.app.listen(3001, () => console.log('listening on port 3001'));
    this.app.use("/", userRoute);
  }
}

export default new App().app;
