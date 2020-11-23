import nextConnect from "next-connect";
import middleware from "../../../middlewares/middleware";
import { ObjectId } from "mongodb";

const handler = nextConnect();
handler.use(middleware);

handler.post(async (req, res) => {
  const { name, description, genres, text } = req.body;

  if (!name || !description || !genres || !text) {
    res.status(400).send("Missing field(s)");
    return;
  }
  const data = {
    name,
    description,
    genres,
    text,
    creator: ObjectId(req.user._id),
  };
  await req.db.collection("posts").insertOne(data);

  res.status(201).json({
    post: data,
  });
});

handler.get(async (req, res) => {
  if (!req.user) {
    req.status(401).end();
    return;
  }
  const id = req.query.id;
  const userId = req.query.userId;
  if (id) {
    const post = await req.db
      .collection("posts")
      .findOne({ _id: ObjectId(id) });
    res.json({ post });
  } else {
    const posts = await req.db
      .collection("posts")
      .find({ creator: ObjectId(userId || req.user._id) })
      .toArray();
    res.json({ posts });
  }
});

handler.delete(async (req, res) => {
  if (!req.user) {
    req.status(401).end();
    return;
  }
  const { id } = req.body;
  const postsCollection = req.db.collection("posts");
  if (typeof id === "string") {
    await postsCollection.deleteOne({ _id: ObjectId(id) });
  } else if (typeof id === "object") {
    await postsCollection.deleteMany({
      _id: { $in: id.map((e) => ObjectId(e)) },
    });
  }
  res.json({ deletedId: id });
});

handler.put(async (req, res) => {
  const { name, description, genres, text, id } = req.body;

  if (!name || !description || !genres || !text || !id) {
    res.status(400).send("Missing field(s)");
    return;
  }
  const data = {
    name,
    description,
    genres,
    text,
  };
  const find = await req.db.collection("posts").findOne({ _id: ObjectId(id) });

  if (
    !req.user.isAdmin &&
    ObjectId(req.user._id).toString() !== ObjectId(find.creator).toString()
  ) {
    return res.status(403).send("No Permission to Access.");
  }
  await req.db
    .collection("posts")
    .updateOne({ _id: ObjectId(id) }, { $set: data });

  res.status(201).json({
    post: data,
  });
});

export default handler;