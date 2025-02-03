import express, { Request, Response } from "express";
import cors from "cors";
import axios from "axios";

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
  // Compute on absolute value (though for positive numbers, it makes no difference)
  const digits = Math.abs(num).toString().split("").map(Number);
  const power = digits.length;
  const sum = digits.reduce((acc, digit) => acc + Math.pow(digit, power), 0);
  return sum === num;
};

// Calculate the sum of the digits (using the absolute value so the minus sign doesn't interfere)
const getDigitSum = (num: number): number => {
  return Math.abs(num)
    .toString()
    .split("")
    .reduce((acc, digit) => acc + parseInt(digit), 0);
};

// API route
app.get("/api/classify-number", async (req: Request, res: Response): Promise<void> => {
  const { number } = req.query;

  // If no number is provided or an empty string, return all values as null
  if (number === undefined || number === "") {
    res.status(400).json({
      number: "",
      error: true
    });
    return;
  }

  const digit = parseInt(number as string, 10);

  if (isNaN(digit)) {
    res.status(400).json({ number, error: true });
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
  // Always add parity (even/odd)
  properties.push(digit % 2 === 0 ? "even" : "odd");

  // Fetch fun fact from the Numbers API.
  // Note: The Numbers API might not support negative numbers.
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