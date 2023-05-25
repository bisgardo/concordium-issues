import {
    BrowserWalletConnector,
    CONCORDIUM_WALLET_CONNECT_PROJECT_ID, WalletConnectConnection,
    WalletConnectConnector
} from "@concordium/wallet-connectors";
import {
    AccountAddress,
    AccountTransactionType,
    CcdAmount
} from "@concordium/web-sdk";

const TESTNET_GENESIS_BLOCK_HASH = '4221332d34e1694168c2a0c0b3fd0f273809612cb13d000d5c2e00e85f50f796';
const TESTNET = {
    name: 'testnet',
    genesisHash: TESTNET_GENESIS_BLOCK_HASH,
    jsonRpcUrl: 'https://json-rpc.testnet.concordium.com',
    ccdScanBaseUrl: 'https://testnet.ccdscan.io',
};

const WALLET_CONNECT_OPTS = {
    projectId: CONCORDIUM_WALLET_CONNECT_PROJECT_ID,
    metadata: {
        name: 'Example',
        description: '',
        url: '#',
        icons: ['https://walletconnect.com/walletconnect-logo.png'],
    },
};

const RECEIVER_ADDRESS = "3v1JUB1R1JLFtcKvHqD9QFqe2NXeBF53tp69FLPHYipTjNgLrV"; // CCD drop account
const AMOUNT_CCD = 10;

document.addEventListener("DOMContentLoaded", () => {
    const transferBrowserWallet = document.getElementById("transfer-bw");
    const transferWalletConnect = document.getElementById("transfer-wc");

    let browserWalletConnection = null;
    let walletConnectConnection = null;

    class MyDelegate {
        onAccountChanged = (connection, address) => {
            console.log('Account changed', {connection, address})
        };

        onChainChanged = (connection, genesisHash) => {
            console.log('Chain changed', {connection, genesisHash})
        };

        onConnected = (connection, address) => {
            console.log('Connection established', {connection, address})
        };

        onDisconnected = (connection) => {
            console.log('Connection destroyed', {connection})
        };
    }

    console.log('Browser Wallet: initializing connector');
    BrowserWalletConnector.create(new MyDelegate()).then(connector => {
        console.log('Browser Wallet: connecting');
        connector.connect().then(connection => {
            browserWalletConnection = connection;
            transferBrowserWallet.disabled = false;
        }, console.error);
    }, console.error);
    console.log('WalletConnect: initializing connector');
    WalletConnectConnector.create(WALLET_CONNECT_OPTS, new MyDelegate(), TESTNET).then(connector => {
        console.log('WalletConnect: connecting');
        connector.connect().then(connection => {
            if (connection) {
                walletConnectConnection = connection;
                transferWalletConnect.disabled = false;
            }
        }, console.error);
    }, console.error);

    const payload = {
        amount: new CcdAmount(BigInt(AMOUNT_CCD * 1e6)),
        toAddress: new AccountAddress(RECEIVER_ADDRESS),
    };
    transferBrowserWallet.addEventListener("click", () => {
        const senderAddress = browserWalletConnection.getConnectedAccount();
        console.log('Browser Wallet: Requesting transfer', {senderAddress}, payload);
        browserWalletConnection.signAndSendTransaction(senderAddress, AccountTransactionType.Transfer, payload).then(tx => {
            console.log('Browser Wallet: Transfer successfully submitted', {tx});
        }, console.error);
    });
    transferWalletConnect.addEventListener("click", () => {
        const senderAddress = walletConnectConnection.getConnectedAccount();
        console.log('WalletConnect: Requesting transfer', {senderAddress}, payload);
        walletConnectConnection.signAndSendTransaction(senderAddress, AccountTransactionType.Transfer, payload).then(tx => {
            console.log('WalletConnect: Transfer successfully submitted', {tx});
        }, console.error);
    });
});
