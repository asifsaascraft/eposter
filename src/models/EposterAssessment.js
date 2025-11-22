import mongoose from "mongoose";

const eposterAssessmentSchema = new mongoose.Schema({
    abstractId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Eposter",
        required: true,
        unique: true       // ❗ Only one assessment per poster
    },
    judgeId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Admin", 
        required: true     // Store reference of judge who scored
    },
    scores: {
        researchTopic: { type: Number, required: true },
        methods: { type: Number, required: true },
        results: { type: Number, required: true },
        presentation: { type: Number, required: true },
        qa: { type: Number, required: true }
    },
    comments: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date }
});

export default mongoose.model("EposterAssessment", eposterAssessmentSchema);
