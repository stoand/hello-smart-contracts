<script lang="ts">
    import { WsProvider, ApiPromise } from "@polkadot/api";

    const ALEPH_ZERO_TESTNET_WS = "wss://ws.test.azero.dev";
    const ACCOUNT = '5DCwWjuUJ8EaExG5iH94WQ3bq5rtLRhxwYCEsKU2Ry9atLHm';

    let free = '';

    async function init() {
        const wsProvider = new WsProvider(ALEPH_ZERO_TESTNET_WS);
        const polkadot = await ApiPromise.create({ provider: wsProvider });
        const account = await polkadot.query.system.account(ACCOUNT);
        free = account.data.free.toString();
    }

    init();
</script>

<p>

    Account<br> <b>{ACCOUNT}</b> has<br><b>{free}</b> free balance.
</p>
