import express, { Request, Response } from "express";
import cors from "cors";
import axios from "axios";
import https from "https";          // For the keep-alive ping
import cron from "node-cron";     // For scheduling the ping

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// Check for prime (note: negative numbers are not considered prime)
const isPrime = (num: number): boolean => {
  if (num < 2) return false;
  for (let i = 2; i * i <= num; i++) {
    if (num % i === 0) return false;
  }
  return true;
};

// Check for perfect number (negative numbers are not perfect)
const isPerfect = (num: number): boolean => {
  if (num <= 0) return false;
  let sum = 1;
  for (let i = 2; i * i <= num; i++) {
    if (num % i === 0) {
      sum += i;
      if (i !== num / i) sum += num / i;
    }
  }
  return sum === num && num !== 1;
};

// Check for Armstrong number
// Negative numbers are not considered Armstrong numbers.
const isArmstrong = (num: number): boolean => {
  if (num < 0) return false;
  const digits = num.toString().split("").map(Number);
  const power = digits.length;
  const sum = digits.reduce((acc, digit) => acc + Math.pow(digit, power), 0);
  return sum === num;
};

// Calculate the sum of the digits.
// For negative numbers, return the negative of the sum of the digits.
const getDigitSum = (num: number): number => {
  const absSum = Math.abs(num)
    .toString()
    .split("")
    .reduce((acc, digit) => acc + parseInt(digit), 0);
  return num < 0 ? -absSum : absSum;
};

// API route
app.get("/api/classify-number", async (req: Request, res: Response): Promise<void> => {
  const { number } = req.query;
  const numStr = number as string;
  const digit = parseInt(number as string, 10);

  // If no number is provided or an empty string, or the input is not numeric, return error response
  if (number !== undefined && (number === "" || isNaN(digit))) {
    res.status(400).json({
      number: "alphabet",
      error: true
    });
    return;
  } 

  if (!/^-?\d+$/.test(numStr)) {
    res.status(400).json({
      number: "alphabet",
      error: true
    });
    return;
  }

  // Prevent processing of extremely large numbers (e.g., larger than 1e9)
  if (Math.abs(digit) > 1e9) {
    res.status(400).json({ number: digit, error: "Number is too large to process." });
    return;
  }

  const properties: string[] = [];

  // Only add 'armstrong' if the number is non-negative and satisfies the Armstrong condition
  if (isArmstrong(digit)) {
    properties.push("armstrong");
  }
  properties.push(digit % 2 === 0 ? "even" : "odd");

  let funFact = "No fun fact available.";
  try {
    const response = await axios.get(`http://numbersapi.com/${digit}/math`);
    if (response.data && typeof response.data === "string") {
      funFact = response.data;
    }
  } catch (error) {
    console.error("Error fetching fun fact:", error);
  }

  res.json({
    number: digit,
    is_prime: isPrime(digit),
    is_perfect: isPerfect(digit),
    properties,
    digit_sum: getDigitSum(digit),
    fun_fact: funFact,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Keep the app active on Render by pinging it every 5 minutes
function keepAlive(url: string): void {
  https
    .get(url, (res) => {
      console.log(`Status: ${res.statusCode}`);
    })
    .on("error", (error) => {
      console.error(`Error: ${error.message}`);
    });
}

// Replace with your actual Render URL
const urlToPing = process.env.RENDER_URL;

// Schedule a ping every 5 minutes using cron
cron.schedule("*/5 * * * *", () => {
  if (urlToPing) {
    keepAlive(urlToPing);
    console.log("Pinging the server every 5 minutes");
  } else {
    console.error("RENDER_URL is not defined.");
  }
});
