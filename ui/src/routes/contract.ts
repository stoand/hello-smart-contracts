import { web3Accounts, web3Enable } from "@polkadot/extension-dapp";
import { WsProvider, ApiPromise } from "@polkadot/api";
import { keyring } from "@polkadot/ui-keyring";
import { ContractPromise } from "@polkadot/api-contract";

const ALEPH_ZERO_TESTNET_WS = "wss://ws.test.azero.dev";
const CONTRACT = "5CV6BooUATcJTeWF8dU3C8rscvcY6mhCoXC9NVayb1MfHbdR";
import CONTRACT_META from "../contract-meta.json";

export let gasLimit: any;

export async function initContract() {
    await web3Enable("attendance-manager");
    let accounts = await web3Accounts();

    // account = accounts.find((acc) => acc.address == $page.params.account);

    const wsProvider = new WsProvider(ALEPH_ZERO_TESTNET_WS);
    const api = await ApiPromise.create({ provider: wsProvider });

    gasLimit = api.registry.createType("WeightV2", {
        refTime: 3912368128,
        proofSize: 131072,
    }) as any;
    
    return new ContractPromise(api, CONTRACT_META, CONTRACT);
}
