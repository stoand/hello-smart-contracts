import { web3Accounts, web3Enable, web3FromSource } from "@polkadot/extension-dapp";
import { WsProvider, ApiPromise } from "@polkadot/api";
import { keyring } from "@polkadot/ui-keyring";
import { ContractPromise } from "@polkadot/api-contract";

const ALEPH_ZERO_TESTNET_WS = "wss://ws.test.azero.dev";
const CONTRACT = "5CgTDMShNYvkDqkDzfhgMjshZe7JeD8ahvtusd9u9EJk9rhy";
import CONTRACT_META from "../contract-meta.json";

export let gasLimit: any;
export let account: any;
export let injector: any;

export async function initContract(accountAddress: string) {
    await web3Enable("attendance-manager");
    let accounts = await web3Accounts();

    account = accounts.find((acc) => acc.address == accountAddress);
    injector = await web3FromSource(account.meta.source);

    const wsProvider = new WsProvider(ALEPH_ZERO_TESTNET_WS);
    const api = await ApiPromise.create({ provider: wsProvider });

    gasLimit = api.registry.createType("WeightV2", {
        refTime: 3912368128,
        proofSize: 131072,
    }) as any;
    
    return new ContractPromise(api, CONTRACT_META, CONTRACT);
}
