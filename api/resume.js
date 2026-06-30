import { createRequire } from "module";

const require = createRequire(import.meta.url);
const resume = require("./backend/data.js");

export default function handler(req, res) {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "s-maxage=600, stale-while-revalidate=59");
  res.status(200).json(resume);
}
