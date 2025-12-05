# sideshift-payment-toolkit Node.js

This Node.js library **Simplifies cryptocurrency payment integration** for developers who want to accept crypto payments without building complex blockchain infrastructure.

It enables cryptocurrency payments in your project by interacting with the [SideShift API](https://sideshift.ai/a/9iuC2qrEj) using the [sideshift-api](https://www.npmjs.com/package/sideshift-api) module. Allowing you to integrate cryptocurrency payment processing in any Node.js project with just a few tweaks. 

With real-time payment processing support, polling for transaction confirmations, 250+ cryptocurrencies and multi-currency support including USD, EUR, JPY, etc.

This library handles both integration methods:
- Custom integration
- [SideShift Pay](https://pay.sideshift.ai/) Checkout integration

**Features**
- Full TypeScript support
- Real-time payment processing
- 250+ cryptocurrency support
- Multi-currency (USD, EUR, JPY)
- Two integration methods:
  - Custom integration
  - SideShift Pay Checkout integration
- High-level API interface

**Key Capabilities**
- Request quotes and checkout
- Create fixed/variable shifts
- Manage checkout flows
- Validate coins and networks
- Download coin icons
- Get blockchain explorer links
- Handle IP address parsing
- Sanitize and validate inputs
- And more...



## Table of Contents
- [Description](#description)
  - [Integration Methods][#integration-methods]
    -[Custom Integration](#custom-integration)
    -[Checkout Integration](#checkout-integration)
  - [Components](#components)
- [Installation](#installation)
- [Configuration](#configuration)
  - [API Credentials](#api-credentials)
  - [Payment Settings](#payment-settings)
  - [Wallet Configuration](#wallet-configuration)
  - [Load Crypto Payment Processor](#load-crypto-payment-processor)
  - [Load Payment Poller System](#load-payment-poller-system)
  - [Initialization](#initialization)
- [Usage](#usage)
- [Checkout Integration Guide](#checkout-integration-guide)
  - [Webhook Manager](#webhook-manager)
- [Custom Integration Guide](#custom-integration-guide)
- [Features](#features)
  - [Detailed Shift function](#detailed-shift-function)
  - [Coin helpers](#coin-helpers)
  - [Explorer Links](#explorer-links)



## Description
This library wraps the SideShift API with additional helper functions, validation utilities, and background polling support for tracking payment statuses.

It supports:

- Creating fixed & variable shifts
- Handling checkout flows
- Managing multiple wallets (main + secondary)
- Coin/network validation
- IP address parsing
- SVG icon downloading
- Full API endpoint access
- And more...


### Integration Methods

#### Custom Integration
Full control implementation where your server handles all processing logic.

**Characteristics:**
- Server-side processing: All transaction handling occurs on your website's server
- Direct API calls: Your server makes direct requests to SideShift API endpoints
- Complete control: You manage the entire flow from start to finish
- Real-time tracking: Your system monitors transaction status continuously
- Custom logic: You can implement your own business rules and validation


#### Checkout Integration
Simplified implementation using SideShift's hosted checkout page.

**Characteristics:**
- Hosted solution: SideShift handles the entire checkout experience
- Single API call: Request a checkout link and redirect users
- Platform management: SideShift manages transaction lifecycle
- Automatic redirects: Users are automatically sent to success/cancel pages
- Reduced server load: Minimal server-side processing required
- Webhook confirmation: SideShift will send success status using a webhook


#### Key Differences

| Aspect | Custom Integration | Checkout Integration |
|--------|-------------------|---------------------|
| **Complexity** | High | Low |
| **Control** | Full | Limited |
| **Development Time** | Longer | Shorter |
| **Maintenance** | Higher | Lower |
| **User Experience** | Customizable | SideShift Checkout |
| **Server Requirements** | High | Low |
| **Error Handling** | Custom | Platform-managed |



### Components
| Component | Purpose |
|-----------|---------|
| `ShiftProcessor` | Handles creation and management of crypto payments via `sideshift-api`. |
| `PaymentPoller` | Polls the SideShift API for payment confirmations and triggers success/failure callbacks. |
| `webhook-manager` | Manages SideShift webhooks. |
| `Helpers` | Utility functions to ease shift processing and verification. |




## Installation 

### Prerequisites

SideShift account: Ensure you have an active SideShift account.
- **Account ID**: Your unique identifier on SideShift Website/API. It can also be used as the affiliateId to receive commissions.
- **Private Key**: Your API secret key used for authentication.
Both can be acquired from sideshift.ai account page, you will find them on the dashboard

**Detailed explanation:** Navigate to [SideShift.ai](https://sideshift.ai/a/9iuC2qrEj), click on the "Account" option in the top right corner menu, and you will find your SideShift ID and Private Key on the dashboard (if this is your first visit, you will be prompted to save your private key)


### Dependencies
This toolkit requires:
- `fs` (built-in Node.js module)
- [sideshift-api](https://github.com/ryo-ohki-code/sideshift-api-node/) SideShift API client.


### Toolkit Installation
Install via npm:

```bash
npm install sideshift-api-payment-toolkit
npm install fs sideshift-api
```


### Demo Server Installation
Sample configurations for demo_integration.js server.


**Set .env file**
```bash
SIDESHIFT_ID=Your_Sideshift_ID 
SIDESHIFT_SECRET=Your_Sideshift_Secret
WALLET_ADDRESS=0x...
WEBSITE_URL=https://your-url.com
```

**Install and Start Demo Server**
```bash
npm install express pug dotenv express-rate-limit fs
node demo_integration.js
```

📝 **Note**: At first start, it will download and store the coin icons.

```javascript
// Path to store downloaded icons
const ICON_PATH = './public/icons';
```



## Configuration

### API Credentials
```javascript
const SIDESHIFT_CONFIG = {
	secret: process.env.SIDESHIFT_SECRET, // "Your_sideshift_ID"; 
	id: process.env.SIDESHIFT_ID, //"Your_shideshift_secret";
	commissionRate: "0.5", // from 0 to 2 %
	verbose: true
}
```

**How to get your API credentials?**

See "Prerequisites".


### Payment Settings
```javascript
SHOP_SETTING.currency = "USD"; // Supported currencies: USD, EUR, JPY... (ISO 4217 code standard)
SHOP_SETTING.USD_REFERENCE_COIN = "USDT-bsc"; // Must be a coin-network from the coinList
CURRENCY_SETTING.SHIF_LIMIT_USD = 20000; // Max USD amount per shift - This is default do not use unless you have specific account on SideShift with higher limit
```


### Wallet Configuration

⚠️ **Why Two Wallets Setting?**
The SideShift API doesn't support same-coin-network shifts (e.g., BTC-bitcoin to BTC-bitcoin). 
This is a technical limitation that requires separate wallets for the 'from' and 'to' networks.

```javascript
const MAIN_WALLET = {
	coin: "USDT",
	network: "bsc",
	address: process.env.WALLET_ADDRESS, // "Your wallet address",
	isMemo: [false, ""] // Set to [false, ""] or if your wallet need a Memo set to [true, "YourMemoHere"]
}

const SECONDARY_WALLET = {
	coin: "BNB",
	network: "bsc",
	address: process.env.WALLET_ADDRESS, // "Your wallet address",
	isMemo: [false, ""]
}

const MAIN_COIN = `${MAIN_WALLET.coin}-${MAIN_WALLET.network}`;
const SECONDARY_COIN = `${SECONDARY_WALLET.coin}-${SECONDARY_WALLET.network}`;

const WALLETS = {
    [MAIN_COIN]: MAIN_WALLET,
    [SECONDARY_COIN]: SECONDARY_WALLET
};
```

⚠️ Important Notes
1. Wallets can be set on different networks (we only use 'bsc' for simplicity in this example, with 2 different coins, this is the easiest setting)
2. You cannot set the same coin-network twice
    - ❌ Invalid: USDT-ethereum and USDT-ethereum
    - ✅ Valid: USDT-ethereum and USDT-bsc
    - ✅ BTC-bitcoin and ETH-ethereum
3. You can use only one wallet configuration, but this will require further settings for payment validation.

#### Minimal required setting**:

`Custom integration` can be used with a single wallet. However, same-coin shifts may throw errors or require the main wallet to generate 'internal shift data.' Custom logic must be implemented for each coin/blockchain. **See 'Detailed one wallet setting' for more information.**

`Checkout integration` do not support same coin shift since all payment processing is done on the SideShift side. This is a SideShift API limitation. It is not possible to set two wallet setting with `checkout integration` since coin selection is done on sideshift side.

```
const WALLETS = {
    [MAIN_COIN]: MAIN_WALLET
};
```

#### Quick Setup Steps
1. Choose integration type (custom vs checkout)
2. Configure wallet(s)
3. Set custom logic for same-coin shifts if using only one wallet (Custom integration only)

#### Integration Type Comparison

| Type | Wallets Needed | Same-Coin Shifts | Complexity |
|------|---------------|------------------|------------|
| Custom | 1 | Requires custom logic | High |
| Custom | 2 | No custom logic | Medium |
| Checkout | 1 | Not supported | Low |

Important to know:
- **Without wallet**: Only minimal toolkit functionality will be available.
- **One wallet**: Single wallet with custom logic per coin/blockchain
- **Two wallet**: Two separate wallets required (due to SideShift API limitations for same coin shift)


### Load Crypto Payment Processor
```javascript
const ShiftProcessor = require('./ShiftProcessor.js')
const shiftProcessor = new ShiftProcessor({
  wallets: WALLETS, // optional - needed to receive payment
  sideshiftConfig: SIDESHIFT_CONFIG,
  currencySetting: SHOP_SETTING // optional, default to USD if not set
});
```

**Without wallet settings, all wallet-related functions will be disabled**. To use wallet features, enable wallet settings in the module configuration.:

```javascript
const ShiftProcessor = require('./ShiftProcessor.js')
const shiftProcessor = new ShiftProcessor({
  sideshiftConfig: SIDESHIFT_CONFIG // Minimal required setting
});
```


### Load Payment Poller System (Custom Integration Only)
Important: Only custom integration requires the polling system. Do not use for checkout integration.

```javascript
const POLLING_CONFIG = {
        active: true, // Polling System active status - default false
        intervalTimeout: 10000, // Interval ms between 2 API call - default 20000
        resetCryptoPayment: "cancelCryptoPayment", // Failure callbacks function method name
        confirmCryptoPayment: "confirmCryptoPayment" // Success callbacks function method name
};

// Initiate Polling System
const cryptoPoller = shiftProcessor.cryptoPollerInit(POLLING_CONFIG);
```

Start polling:
```javascript
cryptoPoller.addPayment({ shift, settleAddress: shift.settleAddress, settleAmount: shift.settleAmount, customId: id });
```

Start polling with single wallet setting:
```
const isInternal = isInternalId(shift.id); // You must use this with single wallet setting to detect 'forged internal shift'
cryptoPoller.addPayment({ shift, settleAddress: shift.settleAddress, settleAmount: shift.settleAmount, customId: id, isInternal });

```

Get polling data for a shift:
```javascript
const results = await cryptoPoller.getPollingShiftData(shiftId);
```

Stop polling for a shift:
```javascript
await cryptoPoller.stopPollingForShift(shiftId);
```


### Webhook Manager (Checkout Integration Only)

```javascript
// Setup the webhook (this will run it once and store data into `webhook-status.` to avoid setting multiple at server restart)
function startWebhook() {
    try {
        shiftProcessor.setupSideShiftWebhook(WEBSITE_URL, process.env.SIDESHIFT_SECRET);
    } catch (error) {
        console.log(error);
    }
}
startWebhook();

// To delete a webhook
function deleteWebhook() {
    try {
        shiftProcessor.deleteWebhook(process.env.SIDESHIFT_SECRET);
    } catch (error) {
        console.log(error);
    }
}
// deleteWebhook();
```



### Initialization
To work, the module needs access to the SideShift coins list, which must be loaded at server start.

Parameter
ICON_PATH (save path for the icons)

```javascript
await shiftProcessor.updateCoinsList(ICON_PATH);
```


**Sample integration**
```javascript
// Start server after receiving the coin list from sideshift API
shiftProcessor.updateCoinsList(ICON_PATH).then((response) => {
    console.log('Initial coins list loaded');
    availableCoins = response.availableCoins;
    rawCoinList = response.rawCoinList;

    // Check if configuration coins are supported by SideShift
    const isValidCoin_1 = shiftProcessor.helper.isCoinValid(MAIN_COIN);

    if (!isValidCoin_1) {
        console.error("Invalid wallet configuration coin", MAIN_COIN)
        process.exit(1);
    }
    // Uncomment if using 2 wallets configuration
    // const isValidCoin_2 = shiftProcessor.helper.isCoinValid(SECONDARY_COIN);
    // if (!!isValidCoin_2) {
    //     console.error("Invalid wallet configuration coin", SECONDARY_COIN)
    //     process.exit(1);
    // }

    app.listen(port, () => {
        console.log(`HTTP Server running at http://localhost:${port}/`);
    });

    setInterval(async () => {
        const result = await shiftProcessor.updateCoinsList(ICON_PATH);
        // Update global variables
        availableCoins = result.availableCoins;
        rawCoinList = result.rawCoinList;
    }, 12 * 60 * 60 * 1000);

}).catch(err => {
    console.error('Failed to load initial settings:', err);
    process.exit(1);
});
```


## Usage

### For custom integration
See '/selection', '/create-quote' and '/create-payment' routes on the demo server.


### For checkout integration
See 'create-checkout', '/checkout/:status/..."', '/api/webhooks/sideshift' routes on the demo server.

Other usage example: '/paywall'



## Checkout Integration Guide
It is simple as this:

```javascript
const checkout = await shiftProcessor.requestCheckout({
    settleCoin: settleCoin,
    settleNetwork: settleNetwork,
    settleAddress: MAIN_WALLET.address,
    settleMemo: null,
    settleAmount: Number(settleAmount),
    successUrl: `${WEBSITE_URL}/checkout/success/${orderId}/${secretHash}`,
    cancelUrl: `${WEBSITE_URL}/checkout/cancel/${orderId}/${secretHash}`,
    userIp: shiftProcessor.helper.extractIPInfo(req.ip).address,
})
res.redirect(checkout.link);
```

Users are redirected through SideShift's checkout portal. Manual user cancellations redirect to cancelUrl, while successful payments redirect to successUrl.

This integration does not require the polling system since redirection is handled by SideShift. See /api/webhooks/sideshift route.

Refer to /checkout/:status/:orderId/:secret" route for success and cancel status.


### Webhook Manager
Checkout must be used with the webhook notification system. The webhook-manager helps set up the webhook connection and '/api/webhooks/sideshift' POST route. You can use webhookDataConfirmation to validate incoming data.

Create a webhook:
```javascript
shiftProcessor.setupSideShiftWebhook(WEBSITE_URL, process.env.SIDESHIFT_SECRET); //will set the webhook once and save the response into a file.
```

Delete a webhook:
```javascript
shiftProcessor.setupSideShiftWebhook(process.env.SIDESHIFT_SECRET); // Delete the saved webhook
```


## Custom Integration Guide
Use getSettlementData() to get all necessary data.
And then use createCryptocurrencyPayment() to get the shift object (see point 3 bellow).


**getSettlementData(amountFiat, depositCoinNetwork)**:
The getSettlementData function is an asynchronous settlement calculator that determines the appropriate settlement amount, address, and exchange rate for cryptocurrency shift operations based on fiat deposit amounts and deposit coin-network.

Parameters 
- totalFiat (e.g., 100.05)
- depositCoinNetwork (e.g., ETH-ethereum)

```javascript
const data = await shiftProcessor.getSettlementData(Number(totalFiat), depositCoinNetwork); 
```

Return
```javascript
{
  settleData: { // Your destination wallet information
    coin: 'USDT',
    network: 'bsc',
    address: '0x...',
    isMemo: [ false, '' ]
  },
  depositAmount: '124.02480000',
  pairData: { // Shift pair data
    min: '7.290191898306',
    max: '72901.91898306',
    rate: '0.403726247797',
    depositCoin: 'ARB',
    settleCoin: 'USDT',
    depositNetwork: 'arbitrum',
    settleNetwork: 'bsc'
  }
}
```
settleData: Destination wallet information from getSettleWallet()
depositAmount: Calculated cryptocurrency amount to pay
pairData: Exchange pair information including rate, minimum, and maximum limits


### If you want control over each step:
1. Get Destination Wallet: Use getSettleWallet to obtain the settle wallet details


**getSettleWallet(depositCoin)**: Test deposit coin to set settle address
The getSettleWallet function is a wallet selection mechanism that determines which wallet should be used as the destination for settlement operations based on the input coin type and current wallet availability.

```javascript
const depositCoin = ['BNB-bsc', false]; // ['COIN-network', false] or ['COIN-network', "Memo"]
const settleWallet = shiftProcessor.getSettleWallet(depositCoin); 
```

The function returns the appropriate wallet object based on:
- If input coin matches MAIN_COIN: Returns SECONDARY_COIN
- If input coin matches SECONDARY_COIN: Returns MAIN_COIN


2. Convert Fiat Amount: Use usdToSettleAmount to convert the fiat amount into the equivalent cryptocurrency deposit amount. You can use getPair to get complementary data like min/max supported amount for the shift.


**usdToSettleAmount(amountToShift, depositCoin, settleCoin)**: Convert FIAT amount to cryptocurrency amount
The usdToSettleAmount function is an asynchronous cryptocurrency conversion utility that calculates the appropriate cryptocurrency amount to shift based on a fiat deposit amount, considering exchange rates and network costs.

Functionality:
- Converts the input fiat amount to USD (from currencySetting.currency to USD) using the current exchange rate from getCurrencyConvertionRate()
- Applies a 0.02% buffer to compensate for network fees and shift costs
- Directly returns USD amount for stablecoins (USD-based coins)
- For non-stablecoins, calculates the appropriate conversion ratio using _getRatio() method

Parameters 
- amount FIAT currency (e.g., 100.54)
- from (e.g., BTC-bitcoin)
- to (e.g., ETH-ethereum)

```javascript
const amount = await shiftProcessor.usdToSettleAmount(amount, from, to);
```

return
```
1.23456789
```


**Get shift pair information**
Get all information about a pair, rate, minimum and maximum deposit, ...

Parameters 
- from (e.g., BTC-bitcoin)
- to (e.g., ETH-ethereum)

```javascript
const getPairData = await shiftProcessor.sideshift.getPair(from, to);
```

returns pair object from the SideShift API:
```json
{
  "min": "0.0.00010771",
  "max": "1.43608988",
  "rate": "17.298009817772",
  "depositCoin": "BTC",
  "settleCoin": "ETH",
  "depositNetwork": "bitcoin",
  "settleNetwork": "ethereum"
}
```


3. Create Shift: Generate a shift using the SideShift API, this create the fixed shift operation with settlement details


**createCryptocurrencyPayment({ depositCoin, depositNetwork, amountFiat, refundAddress = null, refundMemo = null, userIp = null, externalId = null })**: 
The createCryptocurrencyPayment processes fiat amount into cryptocurrency shift request through the SideShift API. It Handles all necessary step to set the shift.

Parameters
- depositCoin: The deposit coin symbol (e.g., 1INCH)
- depositNetwork: The deposit network identifier (e.g., ethereum)
- amountFiat: The FIAT amount to be payed (e.g., 124.0248)
- userIp (optional): IP address for user tracking and security (e.g., 123.123.123.123)
- externalId (optional): External identifier for tracking purposes

```javascript
const shift = await shiftProcessor.createCryptocurrencyPayment({depositCoin, depositNetwork, amountFiat, userIp});
```

return
```javascript
{
  id: '8c9ba87d02a801a2f254',
  createdAt: '2025-09-25T22:20:54.256Z',
  depositCoin: '1INCH',
  settleCoin: 'USDT',
  depositNetwork: 'ethereum',
  settleNetwork: 'bsc',
  depositAddress: '0x...',
  settleAddress: '0...',
  depositMin: '545.71286601',
  depositMax: '545.71286601',
  type: 'fixed',
  quoteId: '32e676d3-56c2-4c06-a0cd-551a9d3db18b',
  depositAmount: '545.71286601',
  settleAmount: '124.0248',
  expiresAt: '2025-09-25T22:35:51.182Z',
  status: 'waiting',
  averageShiftSeconds: '198.338602',
  rate: '0.227271167174'
}
```

After creating a shift, start polling for status updates:

```javascript
cryptoPoller.addPayment(shift, shift.settleAddress, shift.settleAmount, customerOrderId);

```

Handle responses using:
```javascript
resetCryptoPayment();
confirmCryptoPayment();
```
These functions manage internal state and trigger success/cancel logic based on the shift status.


Refer to the handleCryptoShift middleware and routes: /payment-status, /success/, /cancel/.



## Features

| Shift Feature	| Description |
|:---------|:-------------|
| requestQuoteAndShift | Manual Single-step fixed shift |
| createFixedShiftFromUsd | Automatic shift from USD to configured wallet |
| createVariableShift | Manual variable shift creation |
| requestCheckout | Manual checkkout creation|
| getSettleWallet | Auto-selects wallet |
| usdToSettleCoin  | Return settleAmount from a USD input |
| isShiftAvailable  | Verify if a shift is posisble |
| testMinMaxDeposit  | Verify if deposit amount is between min and max |

| Coin Feature	| Description |
|:---------|:-------------|
| updateCoinsList | Refresh coin data + icons |
| getAvailableCoins | List of all supported coins |
| isCoinValid | Validate coin-network combo |
| isSettleCoinOnline  | Verify if configured coin-network are available |
| isUsdStableCoin  | Test if coin-network is a stable coin |
| isThisCoinOrToken  | Test if coin-network is a coin or a token |
| getTokenAddress | Get token contract address |
| getDecimals  | Return the decimal for a coin/token|
| getCoinNetwork  | Return "coin-network" in a string |
| isSettleOnline  | Verify if coin-network is online |

| Other Feature	| Description |
|:---------|:-------------|
| getCurrencyConvertionRate  | Get the configured fiat USD convsersion rate|
| extractIPInfo | Parse user IPs |
| sortCoinsAndTokens  | Return organized networks, coins and tokens |
| getNetworkExplorer | Generate blockchain explorer link |



### Detailed Shift function

**requestQuoteAndShift()**
One-step creation of a fixed shift.

```javascript
requestQuoteAndShift({
    depositCoin,
    depositNetwork,
    settleCoin,
    settleNetwork,
    settleAddress,
    settleMemo = null,
    depositAmount = null,
    settleAmount = null,
    refundAddress = null,
    refundMemo = null,
    externalId = null,
    userIp = null,
})
```
return fixed shift response


**createFixedShiftFromUsd()**
Create a fixed rate shift using an USD/fiat amount with manual wallet setting.

```javascript
createFixedShiftFromUsd({
    depositCoin,
    depositNetwork,
    refundAddress = null,
    refundMemo = null,
    amountFiat,
    settleAddress,
    settleCoin,
    settleNetwork,
    settleMemo = null,
    externalId = null,
    userIp = null
})
```
return fixed shift response


**createVariableShift({depositCoin, depositNetwork, userIp = null, externalId = null})**:
Automatically selects one of the configured wallets and creates a variable shift. (If only one wallet is configured same coin shift are impossible)

return 
```
variable shift response
```


**requestCheckout()**
Initiates a checkout request via SideShift UI.

```javascript
requestCheckout({
    settleCoin,
    settleNetwork,
    settleAddress,
    settleAmount,
    successUrl,
    cancelUrl,
    settleMemo = null,
    externalId = null,
    userIp = null,
})
```
return checkout response


**Full SideShift API integration**
You can also call any SideShift API endpoint by using (see [sideshift-api-node](https://github.com/ryo-ohki-code/sideshift-api-node) )
```javascript
shiftProcessor.sideshift['endpoint_name']
```


### Coin helpers

**updateCoinsList(destination)**:
Refreshes the system's coin database with the latest information from the SideShift API, including coin details, network information, it also downloads missing icons svg images.

Parameter
destination: The file path or destination where coin icons should be downloaded (e.g., "/icons/")

return
```javascript
{ availableCoins: [availableCoins], lastCoinList: [lastCoinList], rawCoinList: {rawCoinList}, networkExplorerLinks: {networkLinks} }
```
availableCoins: Complete list of available coin-network ([['COIN-network', false], ['COIN-network', "Memo"], ...])
lastCoinList: Most recent coin list for comparison purposes
rawCoinList: Raw coin data from the API
networkExplorerLinks: Generated explorer links for all networks


**getAvailablecoins()**
Returns parsed list of SideShift API  supported coins.

Processes each coin into format: ['coin-network', hasMemo, "Memo"].
Stores raw coin data (rawCoinList) and processed lists (availableCoins, lastCoinList).
Filters USD-based coins (USD_CoinsList).

returns same as updateCoinsList.


**isCoinValid(coinNetwork)**:
Check if a coin-network exists in the SideShift API.


```javascript
shiftProcessor.isCoinValid("ETH-bitcoin") // false
shiftProcessor.isCoinValid("ETH-ethereum") // true
```


**isSettleCoinOnline()**:
Determines whether the main and secondary coins are currently online and available for settlement operations. 
This function has a locking mechanism using _lockNoWallet() to prevent concurrent access if MAIN_COIN or MAIN_COIN are not configured.

return: 
```
[true, true]
```


**isShiftAvailable(depositCoin, depositNetwork, settleCoin, settleNetwork, settleAmount = null)**
Group all tests to verify shift availability


**testMinMaxDeposit(depositCoinNetwork, settleCoinNetwork, settleAmount)**
Test if amount is minDeposit < amount < maxDeposit and return pair data

return pairData or error


**isUsdStableCoin(coin)**
Test if coin is USD stable coin


**isCoinMemo(coinNetwork)**
Test if coin as a Memo


**isThisCoinOrToken(coin, network)**:
Determines whether a specified coin-network combination represents a token (as opposed to a native coin) within the system.

Parameters
coin: The coin symbol or identifier
network: The network identifier (e.g., "ethereum", "bsc")

Returns a boolean value:

- true if the specified coin-network combination is identified as a token
- false if the coin is a native coin or if the coin/network combination cannot be found


**getTokenAddress(coin, network)**:
Retrieves the contract address for a specific token on a given network.

Parameters
coin: The coin symbol or identifier
network: The network identifier (e.g., "ethereum", "bsc")

Returns false if:
- The coin is not found
- The coin is not a token
- The network is not supported
- No contract address exists for the specified network


**getDecimals(coin, network)**
Get decimals precision for a coin/token.

return decimals or null


**usdToSettleCoin**
Convert an USD amount to a settle coin-network cryptocurrency amount



## Other helpers function:
 
**getCoinNetwork(coin, network)** 
return "coin-network" string


**getCurrencyConvertionRate()**:
The getUSDRate function is an asynchronous currency conversion rate fetcher that retrieves the current USD exchange rate from an external API endpoint.

 
**extractIPInfo(ipAddress)**:
Express helper to extract IP address for userIp input

Parameters 
- ipAddress (e.g., 123.123.123.123)

The extractIPInfo function is a comprehensive IP address validator and parser that processes incoming IP addresses and returns structured information about their type and validity. It handles both IPv4 and IPv6 addresses, including IPv4-mapped IPv6 addresses (prefixed with ::ffff:)

```javascript
shiftProcessor.extractIPInfo(req.ip)
```


**Sanitization & Validation**
Sanitize string and number:
```javascript
shiftProcessor.sanitizeString(input)
shiftProcessor.sanitizeNumber(input)
```

Validate string and number:
```javascript
shiftProcessor.validateString(input)
shiftProcessor.validateNumber(input)
```


**isSettleOnline(depositCoin, depositNetwork, settleCoin, settleNetwork)**
Check the online status for deposit and settle coin-network.

return object with Boolean
```javascript
{ isDepositOffline: false, isSettleOffline: false, isShiftOnline: true };
```
or
```javascript
{ isDepositOffline: false, isSettleOffline: true, isShiftOnline: false };
```
isShiftOnline indicate if both deposit and settle are online.


**sortCoinsAndTokens()**
Organize networks, coins and tokens into categorized lists.

Return an object with supportedNetworks, mainnetCoins and tokenByChain
```javascript
{ 
    supportedNetworks: supportedNetworksArray,
    mainnetCoins: mainnetCoinsArray,
    tokenByChain: tokenGroupsArray
}
```


### Explorer Links

**getNetworkExplorer(network)**
Generate explorer link for a given network (e.g., Ethereum).
```
https://3xpl.com/{network}/address/
```



# Licence

MIT
