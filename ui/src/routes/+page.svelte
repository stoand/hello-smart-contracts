<script lang="ts">
    import { WsProvider, ApiPromise } from "@polkadot/api";
    import { keyring } from '@polkadot/ui-keyring';
    import { ContractPromise } from "@polkadot/api-contract";
    import {
        web3Accounts,
        web3Enable,
        web3EnablePromise,
        web3FromSource,
    } from "@polkadot/extension-dapp";
    import { CONTRACT_META } from "./contract-meta";

    const ALEPH_ZERO_TESTNET_WS = "wss://ws.test.azero.dev";
    const ACCOUNT = "5DCwWjuUJ8EaExG5iH94WQ3bq5rtLRhxwYCEsKU2Ry9atLHm";
    const CONTRACT = "5CvxXq49hTR9HFtuCbnWbFe37UpKKSDWukx2nDHtDdPcXaKh";
    let free = "";

    let nonTestingAccounts: any = [];

    async function init() {
        const wsProvider = new WsProvider(ALEPH_ZERO_TESTNET_WS);
        const api = await ApiPromise.create({ provider: wsProvider });

        const contract = new ContractPromise(api, CONTRACT_META, CONTRACT);

        const account = await api.query.system.account(ACCOUNT);
        // const accountPair = keyring.getPair(ACCOUNT);
        free = account.data.free.toString();

        let gasLimit = api.registry.createType("WeightV2", {
            refTime: 3912368128,
            proofSize: 131072,
        }) as any;

        let { result, output } = await contract.query.get(ACCOUNT, {
            gasLimit,
            storageDepositLimit: null,
        });
        console.log(result.toHuman());
        console.log(output?.toHuman());

        const extensions = await web3Enable("attendance-manager");
        if (extensions.length > 0) {
            const accounts = await web3Accounts();
            keyring.loadAll({isDevelopment: true}, accounts);

            let account = keyring.getAccounts().find(acc => acc.address == ACCOUNT);

            nonTestingAccounts = keyring.getAccounts().filter(acc => !acc.meta.isTesting);

            const injector = await web3FromSource(account.meta.source);

            await contract.tx.inc({
                gasLimit,
                storageDepositLimit: null,
            }, 33).signAndSend(account.address, { signer: injector.signer }, result => {
                console.log('got', result);
            });
        }
    }

    init();
</script>

<div>
    <div>Accounts</div>
    {#each nonTestingAccounts as account}
    <div>
        {account.meta.name}
    </div>
    {/each}
    
    
    Account<br /> <b>{ACCOUNT}</b> has<br /><b>{free}</b> free balance.
</div>
