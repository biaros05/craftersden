import express from 'express';
import compression from 'compression';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session';
import { default as connectMongoDBSession} from 'connect-mongodb-session';
import authRouter from './routers/auth.router.mjs';
import blockRouter from './routers/block.router.mjs';
import userRouter from './routers/user.router.mjs';
import postRouter from './routers/post.router.mjs'
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

dotenv.config();
const app = express();


const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Crafter\'s Got the Moves Like Swagger',
    version: '1.0.0',
  },
};


const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Crafter\'s Got the Moves Like Swagger',
      version: '1.0.0',
    },
    components: {
      securitySchemes: {
        GoogleOAuth: {
          type: 'oauth2',
          flows: {
            implicit: {
              authorizationUrl: "https://accounts.google.com/o/oauth2/v2/auth",
              tokenUrl: "https://www.googleapis.com/oauth2/v4/token",
              scopes: {
                profile: 'Access your profile info',
                email: 'Access your email address',
              },
            },
          },
        },
      },
    },
    security: [{ GoogleOAuth: ['email', 'profile'] }], // Apply globally
  },
  apis: ['./routes/*.js'], // Adjust based on your file structure
};

const options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: ['./routers/*.mjs'],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(compression());
app.use(express.json());

const MongoDBStore = connectMongoDBSession(session);
const dbUrl = process.env.ATLAS_URI;

if (!process.env.SECRET) {
  console.error('SECRET NOT SPECIFIED, THIS IS A BIG SECURITY RISK');
}

app.use(session({
  secret: process.env.SECRET ?? 'UNSECURE',
  name: 'id',
  saveUninitialized: false,
  resave: false,
  store: app.get('env') !== 'test' ? new MongoDBStore({
    uri: dbUrl,
    collection: 'sessions'
  }) : null,
  cookie: { 
    maxAge: 1000 * 60 * 120,
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'strict'
  }
}));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//middleware to verify if the request accepts html
function html(req, res, next) {
  if (req.accepts('html')) {
    return next();
  }
  return next('route');
}

app.use(express.static(path.join(__dirname, '../client/dist')));



app.get('/api/alive', (req, res) => {
  return res.json({ alive: true });
});

app.get('/api/helloworld', (req, res) => {
  res.send('hello world!');
});

app.use('/api', authRouter);
app.use('/api', blockRouter);

app.use('/api/user', userRouter);

app.use('/api/post', postRouter);

// Serve index.html for all other routes
app.get('*', html, (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  return;
});

// not found middleware
app.use((req, res, next) => {
  res.status(404).json({message: 'not found'});
  return;
});

app.use(function (err, req, res, next) {
  console.error(err);
  const error = app.get('env') !== 'production' ? err.message : {};
  res.status(err.status || 500);
  res.json({ message: error });
  return;
});

export default app;