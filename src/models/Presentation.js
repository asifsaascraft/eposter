import mongoose from "mongoose";

const presentationSchema = new mongoose.Schema({
    abstractNo: Number,
    author: String,
    title: String,
    track: String,
    hall: String
});

export default mongoose.model("Presentation", presentationSchema);
