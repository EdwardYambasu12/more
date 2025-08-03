const path = require("path");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const registerRoutes = require("./register");
const bodyParser = require("body-parser");
const app = express();
const PORT = process.env.PORT || 5000;




app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));


// MongoDB connection URL (replace with your own URI)
const MONGODB_URI = "mongodb+srv://sportsup14:a4gM6dGvo7SHk9aX@cluster0.db0ee.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Serve static pages
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "dashboard.html"));
});
app.get("/tags", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "participant.html"));
});
app.get("/scan", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "scan.html"));
});
app.get("/clear", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "clear.html"));
});

// Models (import from separate file or define here)
const Registration = require("./models/participant.js");
const Fed = require("./models/fed.js");

// Get all participants
app.get("/souls", async (req, res) => {
  try {
    console.log("Fetching all participants...");
    const participants = await Registration.find({});
    console.log(participants, "Participants fetched successfully");
    res.json(participants);
  } catch (error) {     
    res.status(500).json({ error: "Failed to fetch participants" });
  }
});

app.get("/clear_souls", async(req, res)=>{
  try {
    console.log("Clearing all participants...");
    await Registration.deleteMany({});
    console.log("All participants cleared successfully");
    res.status(200).json({ message: "All participants cleared successfully" });
  } catch (error) {
    console.error("Error clearing participants:", error);
    res.status(500).json({ error: "Failed to clear participants" });
  }

})

app.get("/tags_info", async (req, res) => {
  try {
    console.log("Fetching all participants without photo...");
    
    // Find all documents and exclude the 'photo' field
    const participants = await Registration.find({}, { photo: 0 });

    console.log("Participants fetched successfully");
    res.json(participants);
  } catch (error) {
    console.error("Error fetching participants:", error);
    res.status(500).json({ error: "Failed to fetch participants" });
  }
});


// Individual participant view
app.get("/participant/:id", async (req, res) => {
  try {
    const participant = await Registration.findOne({ id: req.params.id });
    if (!participant) {
      return res.status(404).send("<h2>Participant not found</h2>");
    }

    const imageTag = participant.photo
      ? `<img src="${participant.photo}" alt="Participant Image" class="profile-img"/>`
      : `<div style="text-align:center; color:#9ca3af;">No image available</div>`;

    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>Participant Details</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f9fafb;
            padding: 2rem;
            color: #111827;
          }
          .card {
            max-width: 600px;
            margin: 0 auto;
            background-color: #fff;
            border-radius: 12px;
            padding: 2rem;
            box-shadow: 0 4px 10px rgba(0,0,0,0.1);
          }
          .profile-img {
            display: block;
            margin: 0 auto 1.5rem auto;
            width: 150px;
            height: 150px;
            object-fit: cover;
            border-radius: 50%;
            border: 2px solid #ccc;
          }
          h2 {
            font-size: 1.5rem;
            margin-bottom: 1.5rem;
            color: #1f2937;
            text-align: center;
          }
          .field {
            margin-bottom: 1rem;
          }
          .label {
            font-weight: bold;
            color: #374151;
          }
          .value {
            margin-top: 4px;
            color: #4b5563;
          }
          a.back-link {
            display: inline-block;
            margin-top: 2rem;
            text-decoration: none;
            color: white;
            background-color: #2563eb;
            padding: 0.6rem 1.2rem;
            border-radius: 6px;
            text-align: center;
          }
          a.back-link:hover {
            background-color: #1e40af;
          }
        </style>
      </head>
      <body>
        <div class="card">
          ${imageTag}
          <h2>Participant Details</h2>
          <div class="field"><div class="label">Id:</div><div class="value">${participant.id}</div></div>
          <div class="field"><div class="label">Full Name:</div><div class="value">${participant.fullName}</div></div>
          <div class="field"><div class="label">Email:</div><div class="value">${participant.email}</div></div>
          <div class="field"><div class="label">Phone:</div><div class="value">${participant.phone}</div></div>
          <div class="field"><div class="label">department:</div><div class="value">${participant.color}</div></div>
          <div class="field"><div class="label">Gender:</div><div class="value">${participant.gender}</div></div>
          <div class="field"><div class="label">Cluster:</div><div class="value">${participant.cluster}</div></div>
          <div class="field"><div class="label">Church:</div><div class="value">${participant.church}</div></div>
          <div class="field"><div class="label">Country:</div><div class="value">${participant.country}</div></div>
          <div class="field"><div class="label">Age Group:</div><div class="value">${participant.ageGroup}</div></div>
          <div class="field"><div class="label">Accommodation:</div><div class="value">${participant.accommodation}</div></div>
          
        </div>
      </body>
      </html>
    `);
  } catch (error) {
    console.error(error);
    res.status(500).send("<h2>Server error</h2>");
  }
});

// FEEDING SYSTEM ROUTES

// POST /fed/:id - Mark participant as fed
app.post("/fed/:id", async (req, res) => {
    console.log("called g")
  const id = req.params.id;

 
    const fedEntry = new Fed({
      participantId: id,

      fedAt: new Date(),
    });

    await fedEntry.save();

    console.log(`Participant ${id} marked as fed at ${fedEntry.fedAt}`);
    res.status(201).json({ message: `Participant ${id} marked as fed`, data: fedEntry });
 
});

// GET /fed - Get all fed records
app.get("/fed", async (req, res) => {
  try {
    const fedList = await Fed.find({});
    res.json(fedList);
  } catch (error) {
    res.status(500).json({ message: "Failed to get fed records" });
  }
});

// DELETE /fed - Clear all fed records
app.delete("/fed", async (req, res) => {
  try {
    await Fed.deleteMany({});
    res.status(200).json({ message: "All fed records cleared." });
  } catch (error) {
    res.status(500).json({ message: "Failed to clear fed records" });
  }
});

// Use register routes for registrations
app.use("/api/register", registerRoutes);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
