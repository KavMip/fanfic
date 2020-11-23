import nextConnect from "next-connect";
import middleware from "../../middlewares/middleware";
import { ObjectId } from "mongodb";

const handler = nextConnect();
handler.use(middleware);

handler.get(async (req, res) => {
  const posts = await req.db.collection("posts").find().toArray();
  

  for( const post of posts){
    const user = await req.db.collection("users").findOne({_id:ObjectId(post.creator)})
    post.user = user;
  }
  res.json({ posts });
});

export default handler;