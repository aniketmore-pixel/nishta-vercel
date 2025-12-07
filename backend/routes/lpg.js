const express = require("express");
const router = express.Router();
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// POST /api/lpg/verify
router.post("/verify", async (req, res) => {
  try {
    const {
      aadhar_no,
      consumer_no,
      lpg_refills_3m,
      lpg_avg_cost,
      lpg_avg_refill_interval_days,
    } = req.body;

    // 1. Fetch row by consumer_no
    const { data: stored, error } = await supabase
      .from("lpg_bill")
      .select("*")
      .eq("consumer_no", consumer_no)
      .single();

    // If consumer_no does NOT exist → mark entire Aadhaar as suspicious
    if (error || !stored) {
      await supabase
        .from("lpg_bill")
        .update({ flag: 1 })
        .eq("aadhar_no", aadhar_no); // update all rows of this Aadhaar

      return res.json({
        success: true,
        match: false,
        flag: 1,
      });
    }

    // 2. Ensure consumer_no → aadhar_no mapping
    if (stored.aadhar_no !== aadhar_no) {
      await supabase
        .from("lpg_bill")
        .update({ flag: 1 })
        .eq("consumer_no", consumer_no);

      return res.json({
        success: true,
        match: false,
        flag: 1,
      });
    }

    // 3. Apply lenient matching
    const refillDiff = Math.abs(stored.lpg_refills_3m - Number(lpg_refills_3m));
    const costDiff = Math.abs(
      Number(stored.lpg_avg_cost) - Number(lpg_avg_cost)
    );
    const intervalDiff = Math.abs(
      stored.lpg_avg_refill_interval_days - Number(lpg_avg_refill_interval_days)
    );

    const isMatch =
      refillDiff <= 1 && // leniency for refills
      costDiff <= 150 && // LPG price fluctuates
      intervalDiff <= 10; // slight variation accepted

    const newFlag = isMatch ? 0 : 1;

    await supabase
      .from("lpg_bill")
      .update({ flag: newFlag })
      .eq("consumer_no", consumer_no);

    return res.json({
      success: true,
      match: isMatch,
      flag: newFlag,
    });
  } catch (err) {
    console.error("LPG verification error:", err);
    return res.status(500).json({
      success: false,
      msg: "Server error during LPG verification",
    });
  }
});

module.exports = router;
