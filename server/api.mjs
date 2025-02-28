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

dotenv.config();
const app = express();

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
    maxAge: 1000 * 60 * 20,
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

// Serve index.html for all other routes
app.get('*', html, (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  return;
});

export default app;