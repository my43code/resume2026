const express = require("express"); 
const cors = require("cors");
const resume = require("./data"); 
 
const app = express();
app.use(cors());

app.get("/api/resume", (req, res) => { 
  res.json(resume);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 
