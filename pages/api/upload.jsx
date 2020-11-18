import nextConnect from "next-connect";
import middleware from "../../middlewares/middleware";
import multer from "multer";

const handler = nextConnect();
handler.use(middleware);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/upload/");
  },
  filename: function (req, file, cb) {
    const extArray = file.originalname.split(".");
    const extension = extArray[extArray.length - 1];
    cb(null, file.fieldname + "-" + Date.now() + "." + extension);
  },
});

const upload = multer({ storage });

handler.post(upload.array("postImage"), async (req, res) => {
  if (!req.files) {
    return res.status(400).send("No send image");
  }
  res.status(201).json(req.files);
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;