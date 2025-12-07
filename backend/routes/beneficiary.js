const express = require("express");
const router = express.Router();

// -------------------------------------------
//  POST /api/beneficiary/get
//  BODY: { "aadhar_no": "123456789012" }
// -------------------------------------------
router.post("/get", async (req, res) => {
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

    const { data, error } = await supabase
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

    // Log exact response from Supabase
    console.log("[BENEFICIARY GET] Supabase Response:");
    console.log("Error:", error);
    console.log("Data Returned:", data);

    // Log whether name exists
    if (data && data.full_name) {
      console.log("[BENEFICIARY GET] Full Name Found:", data.full_name);
    } else {
      console.log("[BENEFICIARY GET] Full Name NOT FOUND in result!");
    }

    if (error || !data) {
      console.error("[BENEFICIARY GET] Beneficiary Not Found");
      return res.status(404).json({
        success: false,
        error: "Beneficiary not found",
      });
    }

    console.log("[BENEFICIARY GET] SUCCESS: Sending beneficiary data.\n");

    res.json({
      success: true,
      beneficiary: data,
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
