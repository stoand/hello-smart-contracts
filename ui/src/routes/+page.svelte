<script lang="ts">
    import { WsProvider, ApiPromise } from "@polkadot/api";

    const ALEPH_ZERO_TESTNET_WS = "wss://ws.test.azero.dev";

    async function init() {
        const wsProvider = new WsProvider(ALEPH_ZERO_TESTNET_WS);
        const polkadot = await ApiPromise.create({ provider: wsProvider });
    }

    init();
</script>

<h1>Welcome to SvelteKit</h1>
<p>
    Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation
</p>
