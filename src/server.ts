import express, { Request, Response } from "express";
import cors from "cors";
import axios from "axios";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// Utility functions
const isPrime = (num: number): boolean => {
  if (num < 2) return false;
  for (let i = 2; i * i <= num; i++) {
    if (num % i === 0) return false;
  }
  return true;
};

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

const isArmstrong = (num: number): boolean => {
  if (num < 0) return false; // Negative numbers can't be Armstrong
  const digits = num.toString().split("").map(Number);
  const power = digits.length;
  const sum = digits.reduce((acc, digit) => acc + Math.pow(digit, power), 0);
  return sum === num;
};

const getDigitSum = (num: number): number => {
  return num
    .toString()
    .split("")
    .reduce((acc, digit) => acc + parseInt(digit), 0);
};

// API route
app.get("/api/classify-number", async (req: Request, res: Response): Promise<void> => {
  const { number } = req.query;

  // If no number is provided or it's an empty string
  if (!number || number === "") {
    res.json({
      number: null,
      is_prime: null,
      is_perfect: null,
      properties: [],
      digit_sum: null,
      fun_fact: null,
    });
    return;
  }

  const digit = parseInt(number as string, 10);

  if (isNaN(digit)) {
    res.status(400).json({ number, error: true });
    return;
  }

  // Prevent extremely large numbers to avoid performance issues
  if (digit > 1e9) {
    res.status(400).json({ number: digit, error: "Number is too large to process." });
    return;
  }

  const properties: string[] = [];
  if (isArmstrong(digit)) properties.push("armstrong");
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
