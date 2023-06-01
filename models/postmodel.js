import { Schema, model, models } from "mongoose";

const postSchema = new Schema({
  title: String,
  blog: String,
  date: String,
  ownerid: String,
  owner: String,
  
});

const Post = models.Post || model("Post", postSchema);

export default Post;
