const express = require("express");
const router = express.Router();
const { createClient } = require("@supabase/supabase-js");

// Initialize Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// POST /api/mobile/verify
router.post("/verify", async (req, res) => {
  try {
    const {
      aadhar_no,
      mobile_recharge_amt_avg,
      mobile_recharge_freq_pm,
      provider
    } = req.body;

    // Step 1: Fetch stored record
    const { data: stored, error } = await supabase
      .from("mobile_bill")
      .select("*")
      .eq("aadhar_no", aadhar_no)
      .single();

    if (error || !stored) {
      return res.status(404).json({
        success: false,
        msg: "No mobile bill data found for this Aadhaar"
      });
    }

    // Step 2: Compare values
    const isMatch =
      Number(stored.mobile_recharge_amt_avg) === Number(mobile_recharge_amt_avg) &&
      Number(stored.mobile_recharge_freq_pm) === Number(mobile_recharge_freq_pm) &&
      stored.provider.toLowerCase() === provider.toLowerCase();

    const newFlag = isMatch ? 0 : 1;

    // Step 3: Update flag
    await supabase
      .from("mobile_bill")
      .update({ flag: newFlag })
      .eq("aadhar_no", aadhar_no);

    return res.json({
      success: true,
      match: isMatch,
      flag: newFlag,
    });

  } catch (err) {
    console.error("Error verifying mobile:", err);
    return res.status(500).json({
      success: false,
      msg: "Server error during mobile verification"
    });
  }
});

module.exports = router;
