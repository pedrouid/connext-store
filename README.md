# connext-store

Connext Store Modules

## Install

Install NPM package in your project

```bash
npm install --save connext-store
```

## Setup

For Browsers

```javascript
import ConnextStore from "connext-store";

const store = new ConnextStore(window.localStorage);
```

For React-Native

```javascript
import ConnextStore from "connext-store";
import AsyncStorage from "@react-native-community/async-storage";

const store = new ConnextStore(AsyncStorage);
```

## Advanced Options

```javascript
import ConnextStore from "connext-store";
import AsyncStorage from "@react-native-community/async-storage";
import PisaClient from "pisa-client";
import ethers from "ethers";

const store = new ConnextStore(
  window.localStorage || AsyncStorage, // REQUIRED
  {
    prefix: "CONNEXT_STORE",
    separator: "/",
    pisaClient: new PisaClient(pisaUrl, contractAddress),
    wallet: new ethers.Wallet(privateKey)
  }
);
```
