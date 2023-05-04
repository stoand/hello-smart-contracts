<script lang="ts">
    import { WsProvider, ApiPromise } from "@polkadot/api";
    import { ContractPromise } from "@polkadot/api-contract";
    import { create_animation } from "svelte/internal";
    import { CONTRACT_META } from "./contract-meta";

    const ALEPH_ZERO_TESTNET_WS = "wss://ws.test.azero.dev";
    const ACCOUNT = "5DCwWjuUJ8EaExG5iH94WQ3bq5rtLRhxwYCEsKU2Ry9atLHm";
    const CONTRACT = "5CvxXq49hTR9HFtuCbnWbFe37UpKKSDWukx2nDHtDdPcXaKh";

    let free = "";

    async function init() {
        const wsProvider = new WsProvider(ALEPH_ZERO_TESTNET_WS);
        const api = await ApiPromise.create({ provider: wsProvider });

        const contract = new ContractPromise(api, CONTRACT_META, CONTRACT);

        const account = await api.query.system.account(ACCOUNT);
        free = account.data.free.toString();

        let gasLimitV2 = api.registry.createType("WeightV2", {
            refTime: 3912368128,
            proofSize: 131072,
        }) as any;

        let { result, output } = await contract.query.get(ACCOUNT, {
            gasLimit: gasLimitV2,
            storageDepositLimit: null,
        });
        console.log(result.toHuman());
        console.log(output?.toHuman());
    }

    init();
</script>

<p>
    Account<br /> <b>{ACCOUNT}</b> has<br /><b>{free}</b> free balance.
</p>
