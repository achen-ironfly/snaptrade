# SnapTrade 
---

## Features Overview

The current code implements the following features:

1. **API Status Check** – Verify that the SnapTrade API is reachable
2. **User Registration** – Register a SnapTrade user using a `userId` and receive a `userSecret`
3. **Generate Connection URL** – Create a SnapTrade connection portal URL
4. **Automated Browser Connection** – Use Playwright to open the connection flow and wait for completion
5. **List Accounts** – Retrieve all linked investment accounts
6. **Get Account Balances** – Fetch balances for a specific account
7. **Get Account Activities** – Retrieve account activity and transaction history
8. **Data Normalization** – Convert raw API responses into simplified, structured objects

---

## Requirements

- Node.js
- TypeScript
- node-fetch
- Playwright
- dotenv
- crypto 

---

## Project Structure

Install dependencies:  https://nodejs.org/
```text
├── src/
│   └── snaptrade.ts       # Main application entry
├── .env                # Environment variables
├── package.json
├── tsconfig.json
└── README.md
```

## Installation

```bash
npm init -y
npm install node-fetch dotenv playwright
npm install typescript ts-node @types/node
```

---

## Usage
```bash
npx ts-node .\src\snaptrade.ts
```

---

## Execution Flow

1. **Check API Status**
2. **Ask for userId** 
- Input any string used as a unique identifier.
3. **Generate Connection URL**
- Once the URL is generated, select `Alpaca Paper` as the institution and complete the test connection. 
4. **Fetch Accounts balances and activities (transactions)**
5. **Output normalized data**

---

## Data Structure

### Normalized Accounts
- `id` - Account UUID
- `name` - Account name
- `balance` - Total account balance
- `currency` - Currency code (e.g., USD)

### Normalized Balances
- `cash` - Cash balance
- `currency` - Currency code

### Normalized Transactions
- `transactionId` - Transaction UUID
- `transactionDate` - Transaction date (YYYY-MM-DD)
- `time_local` - Local time 
- `time_utc` - UTC time 
- `amount` - Transaction amount 
- `currency` - Currency code
- `description` - Transaction description
- `institution` - Financial institution name

---