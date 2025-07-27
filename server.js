const fs = require("fs");
const path = require("path");
const express = require("express");
const cors = require("cors");
const registerRoutes = require("./register");

const dataDir = path.join(__dirname, "./data");
const dataFilePath = path.join(dataDir, "registrations.json");
const fedFilePath = path.join(dataDir, "fed.json");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Serve static pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
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

// Get all participants
app.use("/souls", (req, res) => {
  const data = fs.readFileSync(dataFilePath, "utf-8");
  res.json(JSON.parse(data));
});

// Individual participant view
app.get('/participant/:id', (req, res) => {
  const id = req.params.id;
  const data = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
  const participant = data.find(p => p.id == id);

  if (!participant) {
    return res.status(404).send('<h2>Participant not found</h2>');
  }

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
        <h2>Participant Details</h2>

        <div class="field">
          <div class="label">Full Name:</div>
          <div class="value">${participant.fullName}</div>
        </div>

        <div class="field">
          <div class="label">Email:</div>
          <div class="value">${participant.email}</div>
        </div>

        <div class="field">
          <div class="label">Phone:</div>
          <div class="value">${participant.phone}</div>
        </div>

        <div class="field">
          <div class="label">Church:</div>
          <div class="value">${participant.church}</div>
        </div>

        <div class="field">
          <div class="label">Country:</div>
          <div class="value">${participant.country}</div>
        </div>

        <div class="field">
          <div class="label">Age Group:</div>
          <div class="value">${participant.ageGroup}</div>
        </div>

        <div class="field">
          <div class="label">Accommodation:</div>
          <div class="value">${participant.accommodation}</div>
        </div>

        <a href="/" class="back-link">← Back to Dashboard</a>
      </div>
    </body>
    </html>
  `);
});

// === FEEDING SYSTEM ROUTES ===

// POST /fed/:id - Mark participant as fed
app.post("/fed/:id", (req, res) => {
  console.log("called")
  const id = req.params.id;
  console.log(id)
  let fedList = JSON.parse(fs.readFileSync(fedFilePath, "utf-8"));;


  fedList.push({ id, fullName: id, time: new Date().toISOString() });
  fs.writeFileSync(fedFilePath, JSON.stringify(fedList, null, 2));
  res.status(200).json({ message: "Participant marked as fed." });
});

// GET /fed/:id - Check if participant has eaten
app.get("/fed", (req, res) => {
  let fedList = JSON.parse(fs.readFileSync(fedFilePath, "utf-8"));

 

  res.json(fedList)
});

// DELETE /fed - Clear all fed records
app.delete("/fedd", (req, res) => {
  fs.writeFileSync(fedFilePath, "[]");
  res.status(200).json({ message: "All fed records cleared." });
});

// Register route
app.use("/api/register", registerRoutes);

// Fallback root route
app.get("/", (req, res) => {
  res.send("AYAC 2025 Registration Server is running.");
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log('Server running...');
});
