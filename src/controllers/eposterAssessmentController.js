import Eposter from "../models/Eposter.js";
import EposterAssessment from "../models/EposterAssessment.js";
export const getSingleEposter = async (req, res) => {
    try {
        const { abstractNo } = req.params;

        const poster = await Eposter.findOne({ abstractNo });
        if (!poster) return res.status(404).json({ message: "ePoster not found" });

        const assessment = await EposterAssessment.findOne({ abstractId: poster._id })
            .populate("judgeId", "email");

        res.json({
            ...poster.toObject(),
            isJudged: Boolean(assessment),
            assessment: assessment || null
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching ePoster" });
    }
};

export const submitEposterAssessment = async (req, res) => {
    try {
        const { abstractNo, scores, comments } = req.body;
        const judgeId = req.admin._id;   // FIXED

        const poster = await Eposter.findOne({ abstractNo });
        if (!poster) return res.status(404).json({ message: "ePoster not found" });

        const exists = await EposterAssessment.findOne({ abstractId: poster._id });
        if (exists) {
            return res.status(400).json({ message: "Assessment already submitted. Use update endpoint." });
        }

        const assessment = await EposterAssessment.create({
            abstractId: poster._id,
            judgeId,
            scores,
            comments
        });

        res.json({
            message: "Assessment submitted successfully",
            assessment
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to submit assessment" });
    }
};

export const updateEposterAssessment = async (req, res) => {
    try {
        const { abstractNo } = req.params;
        const { scores, comments } = req.body;

        const poster = await Eposter.findOne({ abstractNo });
        if (!poster) return res.status(404).json({ message: "ePoster not found" });

        const updated = await EposterAssessment.findOneAndUpdate(
            { abstractId: poster._id },
            {
                scores,
                comments,
                updatedAt: new Date()
            },
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ message: "Assessment not found" });
        }

        res.json({
            message: "Assessment updated successfully",
            assessment: updated
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to update assessment" });
    }
};
