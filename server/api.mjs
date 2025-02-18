import express from 'express';
import compression from 'compression';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session';
import { default as connectMongoDBSession} from 'connect-mongodb-session';
import authRouter from './routers/auth.router.mjs';
import userRouter from './routers/user.router.mjs';

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
  store: dbUrl ? new MongoDBStore({
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

app.use(express.static(path.join(__dirname, '../client/dist')));



app.get('/api/alive', (req, res) => {
  return res.json({ alive: true });
});

app.get('/api/helloworld', (req, res) => {
  res.send('hello world!');
});

app.use('/api', authRouter);

app.use('/api/user', userRouter);

// Serve index.html for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});


app.use(function (err, req, res) {
  const error = app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.json({ error: error });
});

export default app;