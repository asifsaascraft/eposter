import Eposter from "../models/Eposter.js";
import Presentation from "../models/Presentation.js";
import EposterAssessment from "../models/EposterAssessment.js";
import PresentationAssessment from "../models/PresentationAssessment.js";

export const getAllAbstracts = async (req, res) => {
    try {
        const { type, track, hall, sort, search, judged } = req.query;
        const judgeId = req.user?._id;  // from protect middleware

        // Fetch all
        const [eposters, presentations] = await Promise.all([
            Eposter.find(),
            Presentation.find()
        ]);

        // fetch all assessments of this judge
        const [eposterAssessments, presentationAssessments] = await Promise.all([
            EposterAssessment.find({ judgeId }),
            PresentationAssessment.find({ judgeId })
        ]);

        // Convert to lookup map for fast check
        const eposterDoneMap = new Set(eposterAssessments.map(a => a.abstractId.toString()));
        const presentationDoneMap = new Set(presentationAssessments.map(a => a.abstractId.toString()));

        // Merge results
        let merged = [
            ...eposters.map(e => ({
                id: e._id,
                abstractNo: e.abstractNo,
                author: e.author,
                title: e.title,
                track: e.track,
                hall: null,
                type: "eposter",
                isJudged: eposterDoneMap.has(e._id.toString())
            })),
            ...presentations.map(p => ({
                id: p._id,
                abstractNo: p.abstractNo,
                author: p.author,
                title: p.title,
                track: p.track,
                hall: p.hall,
                type: "presentation",
                isJudged: presentationDoneMap.has(p._id.toString())
            }))
        ];

        // Filter by type
        if (type) merged = merged.filter(i => i.type === type);

        // Filter by track
        if (track) {
            merged = merged.filter(i => i.track?.toLowerCase().includes(track.toLowerCase()));
        }

        // Filter by hall
        if (hall) {
            merged = merged.filter(i => i.hall?.toLowerCase() === hall.toLowerCase());
        }

        // Filter by judged status
        if (judged === "true") {
            merged = merged.filter(i => i.isJudged === true);
        }
        if (judged === "false") {
            merged = merged.filter(i => i.isJudged === false);
        }

        // Searching
        if (search) {
            const q = search.toLowerCase();
            merged = merged.filter(i =>
                i.title.toLowerCase().includes(q) ||
                i.author.toLowerCase().includes(q) ||
                i.track.toLowerCase().includes(q) ||
                String(i.abstractNo).includes(q)
            );
        }

        // Sorting
        if (sort === "asc") merged.sort((a, b) => a.abstractNo - b.abstractNo);
        else if (sort === "desc") merged.sort((a, b) => b.abstractNo - a.abstractNo);
        else if (sort === "alpha") merged.sort((a, b) => a.title.localeCompare(b.title));
        else merged.sort((a, b) => a.abstractNo - b.abstractNo);

        res.json({
            total: merged.length,
            data: merged
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch abstracts", error: err });
    }
};
