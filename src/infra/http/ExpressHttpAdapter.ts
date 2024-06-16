import HttpServer from './HttpServer';
import express, { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import chalk from 'chalk';
import swaggerUi from 'swagger-ui-express';
import fs from 'node:fs';

export interface IRequest {
  body: any;
}

export interface IResponse {
  status(code: number): IResponse;
  send(data?: any): void;
}

export default class ExpressAdapter implements HttpServer {
  app: any;
  private routes: { method: string; url: string }[] = [];
  private readonly isDevelopment: boolean;

  constructor() {
    this.app = express();
    this.app.use(express.json());
    this.isDevelopment = process.env.NODE_ENV === 'development';
    this.setupLogging();
  }

  private setupLogging() {
    const logFormat =
      ':method :url :status :res[content-length] - :response-time ms';
    const colorizedFormat = (tokens: any, req: any, res: any) => {
      const status = tokens.status(req, res);
      const statusColor =
        status >= 500
          ? 'red'
          : status >= 400
          ? 'yellow'
          : status >= 300
          ? 'cyan'
          : 'green';

      return [
        chalk.bold(tokens.method(req, res)),
        chalk.blue(tokens.url(req, res)),
        chalk[statusColor](status),
        tokens['response-time'](req, res),
        'ms',
      ].join(' ');
    };

    this.app.use(morgan(colorizedFormat));
  }

  use(middleware: (req: Request, res: Response, next: NextFunction) => void) {
    this.app.use(middleware);
  }

  register(
    method: string,
    url: string,
    callback: Function,
    middlewares: any[] = []
  ): void {
    const middlewareFunctions = middlewares.map(
      (middleware) => (req: Request, res: Response, next: NextFunction) => {
        return middleware.handle(req, res, next);
      }
    );

    this.app[method](
      url,
      ...middlewareFunctions,
      async (req: any, res: any) => {
        try {
          const output = await callback(req.params, req.body);
          res.json(output);
        } catch (e: any) {
          res.status(e.status || 500).json({
            message: e.message,
          });
        }
      }
    );
    this.routes.push({ method: method.toUpperCase(), url });
  }

  setupSwagger(swaggerFilePath: string): void {
    const swaggerDocument = JSON.parse(
      fs.readFileSync(swaggerFilePath, 'utf8')
    );
    this.app.use(
      '/api-docs',
      swaggerUi.serve,
      swaggerUi.setup(swaggerDocument, {
        swaggerOptions: {
          url: 'http://localhost:3000/api-docs/swagger.json',
        },
      })
    );
  }

  private logRoutes() {
    if (this.isDevelopment) {
      console.log(chalk.yellow('Registered Routes:'));
      this.routes.forEach((route) => {
        console.log(`${chalk.green(route.method)} ${chalk.blue(route.url)}`);
      });
    }
  }

  listen(port: number): void {
    this.app.listen(port, () => {
      console.log(chalk.green(`Server running at http://localhost:${port}`));
      this.logRoutes(); // Log as rotas registradas ao iniciar o servidor, apenas no modo de desenvolvimento
    });
  }
}
