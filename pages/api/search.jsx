import nextConnect from "next-connect";
import middleware from "../../middlewares/middleware";
import { ObjectId } from "mongodb";

const handler = nextConnect();
handler.use(middleware);

handler.get(async (req, res) => {
  const q = req.query.q;

  const posts = await req.db.collection("posts").aggregate([
    {
      $search: {
        "text": {
          path: ["name","text","description"],
          query: q,
        },
      },
    },
	]).toArray();
	for( const post of posts){
    const user = await req.db.collection("users").findOne({_id:ObjectId(post.creator)})
    post.user = user;
  }
  res.json( {posts});
});

export default handler;