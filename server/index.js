import express from 'express';
import dotenv from 'dotenv';
import logger from 'morgan';
import validator from 'express-validator';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import routes from './routes';
import swaggerDocument from '../swagger.json';

dotenv.config();

const port = process.env.PORT;
const options = {
  explorer: true
};

const isDevelopment = process.env.NODE_ENV === 'development';

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(validator());
app.use(cors());

// api routes
app.use(routes);

// api docs
app.use(
  '/api/v1/docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, options)
);

// / catch 404 and forward to error handler
app.use((req, res, next) => {
  /* istanbul ignore next */
  const err = new Error('Not Found');
  /* istanbul ignore next */
  err.status = 404;
  /* istanbul ignore next */
  next(err);
});

// error handler
// will print stacktrace if not production
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    status: err.statusMessage || 'failure',
    errors: {
      message: err.message,
    }
  });
  /* istanbul ignore next */
  if (isDevelopment) {
    next(err);
  }
});

// eslint-disable-next-line no-console
app.listen(port, () => console.log(`Server started on port ${port}`));

export default app;
