const express = require("express");
const router = express.Router();


router.post("/:aadhar_no", async (req, res) => {
  try {
    const supabase = req.app.locals.supabase;
    const { aadhar_no } = req.body;

    if (!aadhar_no) {
      return res.status(400).json({
        success: false,
        error: "aadhar_no is required",
      });
    }

    console.log("\n==============================");
    console.log("[BENEFICIARY GET] Request Received");
    console.log("Aadhaar:", aadhar_no);
    console.log("==============================");

    // -------------------------------
    // 1️⃣ Fetch basic beneficiary data
    // -------------------------------
    const { data: benData, error: benErr } = await supabase
      .from("beneficiary")
      .select(`
        full_name,
        age,
        gender,
        phone_no,
        address,
        income_yearly,
        state,
        district,
        occupation,
        registration_date
      `)
      .eq("aadhar_no", aadhar_no.trim())
      .single();

    console.log("\n[BENEFICIARY GET] Supabase Beneficiary Response:");
    console.log("Error:", benErr);
    console.log("Data Returned:", benData);

    if (benErr || !benData) {
      console.error("[BENEFICIARY GET] Beneficiary Not Found");
      return res.status(404).json({
        success: false,
        error: "Beneficiary not found",
      });
    }

    // ----------------------------------
    // 2️⃣ Fetch region from eligibility table
    // ----------------------------------
    const { data: regionData, error: regionErr } = await supabase
      .from("eligible_beneficiary")
      .select("region")
      .eq("aadhar_no", aadhar_no.trim())
      .maybeSingle();

    console.log("\n[BENEFICIARY GET] Supabase Region Response:");
    console.log("Error:", regionErr);
    console.log("Data Returned:", regionData);

    // If region not found log it
    if (!regionData || !regionData.region) {
      console.log("[BENEFICIARY GET] Region NOT FOUND for this Aadhaar");
    } else {
      console.log("[BENEFICIARY GET] Region Found:", regionData.region);
    }

    // ----------------------------------
    // 3️⃣ Merge both results cleanly
    // ----------------------------------
    const finalResponse = {
      ...benData,
      region: regionData?.region || null, // null if not found
    };

    console.log("\n[BENEFICIARY GET] FINAL RESPONSE SENT TO CLIENT:");
    console.log(finalResponse);
    console.log("==============================================\n");

    res.json({
      success: true,
      beneficiary: finalResponse,
    });

  } catch (err) {
    console.error("[BENEFICIARY GET] Server Error:", err);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});



module.exports = router;
