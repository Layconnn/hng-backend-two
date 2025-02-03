# Number Classification API

## Overview
The **Number Classification API** is a simple RESTful API built with **Node.js** and **Express.js**. It takes a number as a query parameter and returns details about the number, such as:
- Whether it's **prime**
- Whether it's **perfect**
- Whether it's an **Armstrong number**
- Whether it's **even or odd**
- The **sum of its digits**
- A fun fact about the number (from NumbersAPI)

## Features
- Handles **GET** requests.
- Accepts all **valid integers** as input.
- Returns data in a **structured JSON format**.
- Provides **error handling** for invalid inputs.
- Uses **CORS** for cross-origin requests.

---
## Installation

### Prerequisites
Ensure you have **Node.js** installed on your system. If not, download it from [nodejs.org](https://nodejs.org/).

### Clone Repository
```sh
git clone https://github.com/your-repo/number-classification-api.git
cd number-classification-api
```

### Install Dependencies
```sh
npm install
```

### Start the Server
```sh
npm start
```
The server will run on `http://localhost:3000`

---
## API Usage

### **Endpoint**
`GET /api/classify-number?number=<integer>`

### **Request Example**
```sh
GET http://localhost:3000/api/classify-number?number=371
```

### **Successful Response**
```json
{
  "number": 371,
  "is_prime": false,
  "is_perfect": false,
  "properties": ["armstrong", "odd"],
  "digit_sum": 11,
  "fun_fact": "371 is an Armstrong number!"
}
```

### **Error Response (Invalid Input)**
```json
{
  "number": "abc",
  "error": true
}
```

---
## Project Structure
```
number-classification-api/
│── src/
│   ├── server.ts       # Main server file
│── package.json        # Project dependencies & scripts
│── README.md           # API Documentation
```

---
## Technologies Used
- **Node.js**
- **Express.js**
- **TypeScript**
- **Axios** (for fetching fun facts)
- **CORS** (for handling cross-origin requests)

---

---
## License
This project is licensed under the MIT License.

---
## Author
Developed by **Jinadu Olamilekan**

