import mongoose from "mongoose";

const eposterSchema = new mongoose.Schema({
    abstractNo: Number,
    author: String,
    title: String,
    track: String
});

export default mongoose.model("Eposter", eposterSchema);
