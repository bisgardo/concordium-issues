import {detectConcordiumProvider} from "@concordium/browser-wallet-api-helpers";

async function run() {
    const api = await detectConcordiumProvider(1000)
    const account = await api.connect();
    console.log('connected to account', account);
    const client = api.getGrpcClient();
    const status = await client.getConsensusStatus();
    console.log('status:', status);
}

run().catch(console.error);
