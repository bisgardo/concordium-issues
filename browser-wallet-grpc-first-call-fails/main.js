import {detectConcordiumProvider} from "@concordium/browser-wallet-api-helpers";

const buttonElement = document.getElementById("button");
const outputElement = document.getElementById("output");

function log(msg) {
    outputElement.innerText += `${msg}\n`;
}

detectConcordiumProvider(1000)
    .then(api => {
        const client = api.getGrpcClient();
        buttonElement.addEventListener("click", () => {
            client.getConsensusStatus()
                .then(status => {
                    log(JSON.stringify(status, (_, v) => typeof v === 'bigint' ? v.toString() : v));
                })
                .catch(e => {
                    log(`error fetching consensus status: ${e}`);
                })
        });
    })
    .catch(e => {
        log(`error loading wallet API: ${e}`);
    });
