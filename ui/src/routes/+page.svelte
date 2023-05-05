<script lang="ts">
    import { web3Accounts, web3Enable } from "@polkadot/extension-dapp";
    import { polkadotIcon } from "@polkadot/ui-shared";

    let inited = false;
    let accounts: any = [];

    async function init() {
        await web3Enable("attendance-manager");
        accounts = await web3Accounts();

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
                    <svg
                        class="inline-block mr-5"
                        height="70"
                        style="z-index: 999"
                        viewBox="0 0 64 64"
                        width="70"
                    >
                        {#each polkadotIcon( account.address, { isAlternative: false } ) as dot}
                            <circle
                                cx={dot.cx}
                                cy={dot.cy}
                                fill={dot.fill}
                                r={dot.r}
                            />
                        {/each}
                    </svg>

                    {account.meta.name}</a
                >
            {/each}
        {/if}
    </div>
</div>
