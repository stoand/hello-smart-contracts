<script lang="ts">
    import { web3Accounts, web3Enable } from "@polkadot/extension-dapp";

    let inited = false;
    let accounts: any = [];

    async function init() {
        await web3Enable("attendance-manager");
        accounts = await web3Accounts();

        console.log(accounts);

        inited = true;
    }

    init();
</script>

<div>
    <div class="text-5xl ml-16 mt-20">Konto Auswählen</div>

    <div class="ml-16 mt-32">
        {#if !inited}
            <div class="text-3xl">Konten werden geladen ...</div>
        {:else}
            {#each accounts as account}
                <a
                    href="/{account.address}"
                    class="border-solid border-white-transparent2 border-[1px] text-3xl p-10 mr-16 rounded-3xl rounded bg-white-transparent"
                >
                    {account.meta.name}</a
                >
            {/each}
        {/if}
    </div>
</div>
