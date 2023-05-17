# Setup

Page that loads the Browser Wallet API and automatically opens a connection to the wallet and fetches its gRPC client.

Once ready, the button "Query Consensus Status" will trigger a call to `getConsensusStatus` on this client.

All errors and output is logged visibly on the page.

# Problem

The first call triggered by the button fails with the error:

```
error fetching consensus status: TypeError: Cannot read properties of undefined (reading 'endsWith')
```

Subsequent calls succeed.
