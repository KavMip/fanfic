import nextConnect from 'next-connect';
import middleware from '../../../middlewares/middleware';
import { extractUser } from '../../../lib/api-helpers'
import { ObjectId } from 'mongodb';

const handler = nextConnect();
handler.use(middleware);

handler.get(async (req, res) => res.json({ user: extractUser(req) }));

handler.put(async (req, res) => {
  if (!req.user) {
    req.status(401).end();
    return;
  }
  const { name, email, isAdmin, id } = req.body;
  // const senderUser = await req.db.collection('users').findOne({ _id: ObjectId(id) });
  if (req.user.isAdmin || ObjectId(req.user._id).toString() === ObjectId(id).toString()) {
    const setValues = { name, email}
    console.log(setValues);
    if(isAdmin !== undefined && req.user.isAdmin){
      setValues.isAdmin = isAdmin;
    }
    await req.db.collection('users').updateOne(
      { _id: ObjectId(id) },
      {
        $set: setValues
      },
    );
    res.json({ user: setValues });
  }else{
    req.status(403).end();
    return;
  } 
});

export default handler;