import nextConnect from 'next-connect';
import isEmail from 'validator/lib/isEmail';
import normalizeEmail from 'validator/lib/normalizeEmail';
import bcrypt from 'bcryptjs';
import middleware from '../../middlewares/middleware';
import { extractUser } from '../../lib/api-helpers';
import {ObjectId} from 'mongodb'


const handler = nextConnect();

handler.use(middleware); // see how we're reusing our middleware

handler.get(async(req, res)=>{
  if (!req.user) {
    req.status(401).end();
    return;
  }
  const id = req.query.id;
  if (id) {
    const user = await req.db
      .collection("users")
      .findOne({ _id: ObjectId(id) });
    res.json({ user });
  } else{
    const users = await req.db
    .collection("users")
    .find()
    .toArray();
  res.json({ users });
  } 
});


handler.post(async (req, res) => {

  const { name, password } = req.body;
  const email = normalizeEmail(req.body.email); // this is to handle things like jane.doe@gmail.com and janedoe@gmail.com being the same
  if (!isEmail(email)) {
    res.status(400).send('The email you entered is invalid.');
    return;
  }
  if (!password || !name) {
    res.status(400).send('Missing field(s)');
    return;
  }
  const isAdmin = false;

  // check if email existed
  if ((await req.db.collection('users').countDocuments({ email })) > 0) {
   return res.status(403).send('The email has already been used.');
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await req.db
    .collection('users')
    .insertOne({ email, password: hashedPassword, name, isAdmin })
    .then(({ ops }) => ops[0]);

  req.logIn(user, (err) => {
    if (err) throw err;
    // when we finally log in, return the (filtered) user object
    res.status(201).json({
      user: extractUser(req),
    });
  });
});

export default handler;