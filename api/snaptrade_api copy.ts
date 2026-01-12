// import fetch from "node-fetch";
// import * as readline from "readline";
// import crypto from "crypto";
// import { chromium } from "playwright";

// const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout,
// });

// function askQuestion(question: string): Promise<string> {
//     return new Promise((resolve) => {
//         rl.question(question, (answer) => {
//         resolve(answer);
//         });
//     });
// }

// function createAuthorization() {
//     let credentials: { clientId: string; consumerKey: string } | null = null;
    
//     return async (): Promise<{ clientId: string; consumerKey: string }> => {
//         if (credentials) {
//             return credentials;
//         }      
//         const clientId = await askQuestion("Enter your clientId: ");
//         const consumerKey = await askQuestion("Enter your consumerKey: ");
//         credentials = { clientId, consumerKey };
//         return credentials;
//     };
// }

// // 1.--- API Status ---
// const authorization = createAuthorization();
// async function getApiStatus() {
//     const { clientId, consumerKey } = await authorization();
//     const url = "https://api.snaptrade.com/api/v1/";
//     const response = await fetch(url, {
//         method: "GET",
//         headers: {
//         "Content-Type": "application/json",
//         "clientId": clientId,
//         "consumerKey": consumerKey,
//         },
//     });

//     const data = await response.json();
//     console.log("API Status:", data);
// }

// // 2.--- Register User ---
// function jsonOrder(obj: any) {
//     const allKeys: string[] = [];
//     const seen: any = {};
//     JSON.stringify(obj, (key, value) => {
//         if (!(key in seen)) {
//         allKeys.push(key);
//         seen[key] = true;
//         }
//         return value;
//     });
//     allKeys.sort();
//     return JSON.stringify(obj, allKeys);
// }

// function signRequest(
//     body: any,
//     endpoint: string,
//     query: string,
//     consumerKey: string
//     ): string {

//     const sigObject: any = {
//         content: body,
//         path: endpoint,
//         query: query,
//     };
//     const sigContent = jsonOrder(sigObject);

//     return crypto
//         .createHmac("sha256", encodeURI(consumerKey))
//         .update(sigContent)
//         .digest("base64");
// }

// async function registerUser(userId: string): Promise<string> {
//     const { clientId, consumerKey } = await authorization();
//     const endpoint = "/api/v1/snapTrade/registerUser";
//     const timestamp = Math.floor(Date.now() / 1000);
//     const queryParams: Record<string, string> = {
//         clientId: clientId,
//         timestamp: String(timestamp),
//     };
//     const query = Object.keys(queryParams)
//         .sort()
//         .map(key => `${key}=${queryParams[key]}`)
//         .join("&");
//     const body = { userId };
//     const signature = signRequest(body, endpoint, query, consumerKey);
//     const response = await fetch(`https://api.snaptrade.com${endpoint}?${query}`, {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//             "Signature": signature,
//         },
//         body: JSON.stringify(body),
//     });

//     const data = await response.json() as { userSecret: string };
//     console.log(data);

//     return data.userSecret;
// }

// // 3.--- Generate Connection URL ---
// async function generateUrl(userId: string, userSecret: string): Promise<string> {
//     const { clientId, consumerKey } = await authorization();
//     const endpoint = "/api/v1/snapTrade/login";
//     const timestamp = Math.floor(Date.now() / 1000);
//     const params = new URLSearchParams({
//         clientId,
//         timestamp: String(timestamp),
//         userId,
//         userSecret,
//   });
//     const query = params.toString();
//     const signature = signRequest(null, endpoint, query, consumerKey);
//     const response = await fetch(`https://api.snaptrade.com${endpoint}?${query}`, {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//             "Signature": signature,
//         },
//         body: JSON.stringify({}),
//     });

//     const data = await response.json() as { redirectURI: string };
//     console.log("Connection URL response:", data);
//     return data.redirectURI;
// }

// // 4.--- Connection URL ---
// async function connect(redirectURI: string) {
//     // console.log("redirectURI:", redirectURI);
//     // Open the redirect URI in browser using Playwright
//     const browser = await chromium.launch({ headless: false });
//     const page = await browser.newPage();
//     await page.goto(redirectURI);
//     // await page.waitForSelector('[data-testid="disclaimer-continue-btn"]');
//     // await page.click('[data-testid="disclaimer-continue-btn"]');
    
//     // // Wait for and click Alpaca Paper option
//     // await page.waitForSelector('a[href="/connect/ALPACA-PAPER"]');
//     // await page.click('a[href="/connect/ALPACA-PAPER"]');
    
//     // // Wait for and click OAuth Continue button
//     // await page.waitForSelector('[data-testid="oauth-continue-btn"]');
//     // await page.click('[data-testid="oauth-continue-btn"]');
    
//     // // Wait for page to navigate to Alpaca login page
//     // await page.waitForURL('https://app.alpaca.markets/account/login');
    
//     // // Ask user for email and password and handle login with retry logic
//     // let loginSuccess = false;
//     // let email = '';
//     // let password = '';
    
//     // while (!loginSuccess) {
//     //     email = await askQuestion("Please enter your Alpaca email: ");
//     //     password = await askQuestion("Please enter your Alpaca password: ");
        
//     //     // Fill in the email and password fields
//     //     await page.fill('[data-testid="email-input"]', email);
//     //     await page.fill('[data-testid="password-input"]', password);
//     //     await page.waitForSelector('[data-testid="login-button"]');
//     //     await page.click('[data-testid="login-button"]');
//     //     await page.waitForTimeout(3000);
        
//     //     const pageContent = await page.content();
//     //     let hasError = false;
//     //     let errorMessage = '';   
//     //     // Check for validation errors (empty email or password)
//     //     if (pageContent.includes('Please enter an email')) {
//     //         errorMessage = 'Please enter an email. Try again.';
//     //         hasError = true;
//     //     } else if (pageContent.includes('Please enter a password')) {
//     //         errorMessage = 'Please enter a password. Try again.';
//     //         hasError = true;
//     //     } else if (pageContent.includes('Incorrect username or password')) {
//     //         errorMessage = 'Incorrect username or password. Please try again.';
//     //         hasError = true;
//     //         await page.fill('[data-testid="email-input"]', '');
//     //         await page.fill('[data-testid="password-input"]', '');
//     //     }
//     //     else {
//     //         const errorSelector = '.Toastify__toast--error';
//     //         const hasErrorToast = await page.locator(errorSelector).isVisible().catch(() => false);
//     //         if (hasErrorToast) {
//     //             errorMessage = 'Incorrect username or password. Please try again.';
//     //             hasError = true;
//     //             await page.fill('[data-testid="email-input"]', '');
//     //             await page.fill('[data-testid="password-input"]', '');
//     //         }
//     //     }
        
//     //     if (hasError) {
//     //         console.log(errorMessage);
//     //     } else {
//     //         loginSuccess = true;
//     //     }
//     // }
    
//     // // Check for MFA code requirement
//     // const mfaPrompt = await page.textContent('div').then((text: string | null) => text?.includes('Enter your MFA code.') ? true : false).catch(() => false);
    
//     // if (mfaPrompt) {
//     //     const mfaCode = await askQuestion("Please enter your MFA code (6 digits): ");
//     //     const mfaDigits = mfaCode.replace(/\D/g, '').slice(0, 6);       
//     //     if (mfaDigits.length !== 6) {
//     //         console.log("Invalid MFA code. Please enter exactly 6 digits.");
//     //     } else {
//     //         for (let i = 0; i < 6; i++) {
//     //             await page.fill(`[data-testid="mfa-code-input-${i}"]`, mfaDigits[i]);
//     //         }         
//     //         await page.waitForTimeout(8000);
//     //     }
//     // }
    
//     // // Click the checkbox to allow permissions
//     // const checkboxContainer = await page.locator('div:has-text("Paper")').first();
//     // const checkbox = await checkboxContainer.locator('div[tabindex="0"]').first();
//     // if (await checkbox.isVisible().catch(() => false)) {
//     //     await checkbox.hover();
//     //     await page.waitForTimeout(500 + Math.random() * 1000);
//     //     await checkbox.click();
//     //     await page.waitForTimeout(2000 + Math.random() * 2000);
//     // }
    
//     // // Click the Allow button
//     // const allowButton = await page.locator('button:has-text("Allow")');
//     // if (await allowButton.isVisible().catch(() => false)) {
//     //     await allowButton.hover();
//     //     await page.waitForTimeout(500 + Math.random() * 1000);
//     //     await allowButton.click();
//     //     await page.waitForTimeout(3000 + Math.random() * 2000);
//     // }
    
//     // // Click the Done button
//     // const doneButton = await page.locator('button:has-text("Done")');
//     // await doneButton.hover();
//     // await doneButton.click();
    
//     // await browser.close();
// }

// // 5.--- List Accounts ---
// async function listAccounts(userId: string, userSecret: string): Promise<any> {
//     const { clientId, consumerKey } = await authorization();
//     const endpoint = "/api/v1/accounts";
//     const timestamp = Math.floor(Date.now() / 1000);
//     const params = new URLSearchParams({
//         clientId,
//         timestamp: String(timestamp),
//         userId,
//         userSecret,
//     });
//     const query = params.toString();
//     const signature = signRequest(null, endpoint, query, consumerKey);
//     const response = await fetch(`https://api.snaptrade.com${endpoint}?${query}`, {
//         method: "GET",
//         headers: {
//             "Content-Type": "application/json",
//             "Signature": signature,
//         },
//     });

//     const data = await response.json();
//     console.log("Accounts:", data);
//     return data;
// }

// // 6.--- List Account Balances ---
// async function accountBalances(accountId: string, userId: string, userSecret: string): Promise<any> {
//     const { clientId, consumerKey } = await authorization();
//     const endpoint = `/api/v1/accounts/${accountId}/balances`;
//     const timestamp = Math.floor(Date.now() / 1000);
//     const params = new URLSearchParams({
//         clientId,
//         timestamp: String(timestamp),
//         userId,
//         userSecret,
//     });
//     const query = params.toString();
//     const signature = signRequest(null, endpoint, query, consumerKey);
//     const response = await fetch(`https://api.snaptrade.com${endpoint}?${query}`, {
//         method: "GET",
//         headers: {
//             "Content-Type": "application/json",
//             "Signature": signature,
//         },
//     });

//     const data = await response.json();
//     console.log("Account Balances:", data);
//     return data;
// }

// // 7.--- List Account Activities ---
// async function accountActivities(accountId: string, userId: string, userSecret: string): Promise<any> {
//     const { clientId, consumerKey } = await authorization();
//     const endpoint = `/api/v1/accounts/${accountId}/activities`;
//     const timestamp = Math.floor(Date.now() / 1000);
//     const params = new URLSearchParams({
//         clientId,
//         timestamp: String(timestamp),
//         userId,
//         userSecret,
//     });
//     const query = params.toString();
//     const signature = signRequest(null, endpoint, query, consumerKey);
//     const response = await fetch(`https://api.snaptrade.com${endpoint}?${query}`, {
//         method: "GET",
//         headers: {
//             "Content-Type": "application/json",
//             "Signature": signature,
//         },
//     });

//     const data = await response.json();
//     console.log("Account Activities:", data);
//     return data;
// }

// async function main() {
//     console.log("\n--- API Status ---");
//     await getApiStatus();

//     console.log("\n--- Register User ---");
//     const userId = await askQuestion("Enter userId (email): ");
//     const userSecret = await registerUser(userId);

//     console.log("\n--- Generate Connection Portal URL ---");
//     const redirectURI = await generateUrl(userId, userSecret);

//     console.log("\n--- Connect ---");
//     await connect(redirectURI);

//     console.log("\n--- List Accounts ---");
//     const accounts = await listAccounts(userId, userSecret);
//     const accountId = accounts[0].id;

//     console.log("\n--- List Account Balances ---");
//     await accountBalances(accountId, userId, userSecret);

//     console.log("\n--- List Account Activities ---");
//     await accountActivities(accountId, userId, userSecret);
    
//     rl.close();
// }

// main();
