const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Your Google Apps Script Web App URL
const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbwBNEi8pVT1zqRwntuX__ioZwecOwCAroudOxkdsEIAFIUGjEZBFr1AoUocxWgvH0rZ9Q/exec";

app.use(express.json());
app.use(express.static(__dirname));

app.post("/api/contact", async (req, res) => {
    const { fullName, email, phone, message } = req.body;

    // Check all fields
    if (!fullName || !email || !phone || !message) {
        return res.status(400).json({
            success: false,
            message: "All fields are required."
        });
    }

    try {
        // Send enquiry to Google Sheets
        const googleResponse = await fetch(GOOGLE_SCRIPT_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                fullName,
                email,
                phone,
                message
            })
        });

        const result = await googleResponse.json();

        if (!result.success) {
            throw new Error(result.message || "Google Sheets error");
        }

        res.json({
            success: true,
            message: "Enquiry submitted successfully!"
        });

    } catch (error) {
        console.error("Google Sheets Error:", error);

        res.status(500).json({
            success: false,
            message: "Could not save your enquiry. Please try again."
        });
    }
});

app.listen(PORT, () => {
    console.log(`SSP LED Solutions running on port ${PORT}`);
});
