const express = require("express");
const supabase = require("../supabaseClient.js");

const router = express.Router();

// ===============================
// 📌 Get all loan applications by Aadhaar Number
// ===============================
router.get("/applications/:aadhar_no", async (req, res) => {
    const { aadhar_no } = req.params;

    console.log("🔵 Incoming Request -> /applications/", aadhar_no);

    if (!aadhar_no) {
        console.log("❌ Error: aadhar_no missing");
        return res.status(400).json({
            success: false,
            message: "Aadhaar number is required",
        });
    }

    console.log("📌 Received aadhar_no:", aadhar_no);
    console.log("📌 Length:", aadhar_no.length);

    // Aadhaar validation
    if (aadhar_no.length !== 12) {
        return res.status(400).json({
            success: false,
            message: "Aadhaar Number must be exactly 12 digits.",
        });
    }

    try {
        console.log("🟡 Querying Supabase...");

        const { data, error } = await supabase
            .from("track_application")
            .select("*")
            .eq("aadhar_no", aadhar_no)
            .order("applied_on", { ascending: false });

        console.log("🟣 Supabase Response:");
        console.log("➡️ Data:", data);
        console.log("➡️ Error:", error);

        if (error) {
            console.log("🔥 Supabase Error Occurred:", error);
            return res.status(500).json({
                success: false,
                message: "Database error",
            });
        }

        if (!data || data.length === 0) {
            console.log("⚠️ No applications found for Aadhaar:", aadhar_no);
            return res.status(404).json({
                success: false,
                message: "No loan applications found.",
            });
        }

        console.log("✅ Successfully fetched loan applications.");

        return res.json({
            success: true,
            total: data.length,
            applications: data,
        });

    } catch (err) {
        console.error("🔥 INTERNAL ERROR fetching loan applications:", err);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});

module.exports = router;
