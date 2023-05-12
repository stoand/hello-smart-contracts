<script lang="ts">
    export let account = "";
    export let loadedAccount = "";

    let showAccountList = false;

    $: accounts = JSON.parse(localStorage.getItem('admin-account-suggestions') || '[]')
        .filter((acc: any) => acc.address != loadedAccount);

    function shortenAddress(address: string) {
        let chars = address.split("");

        return (
            chars.slice(0, 4).join("") +
            "..." +
            chars.slice(chars.length - 4, chars.length).join("")
        );
    }
</script>

<div class="ml-16">
    <div class="text-3xl mt-20">Konto Id</div>

    <div class="flex mt-6 relative">
        <input on:focus={() => showAccountList = true} on:blur={() => setTimeout(() => showAccountList = false, 300)}
            bind:value={account}
            class="text-2xl p-2 rounded-2xl rounded bg-transparent border-solid border-[1px]"
            type="text"
        />
        {#if accounts?.length > 0 && showAccountList}
            <div
                class="suggestions text-2xl p-2 rounded-2xl rounded bg-blue border-solid border-[1px]"
            >
                {#each accounts as account}
                    <a
                        href="/admin/{account.address}"
                        class="block border-b border-solid p-2"
                    >
                        {account.name}
                        <span class="text-lg text-white-transparent3"
                            >{shortenAddress(account.address)}</span
                        ></a
                    >
                {/each}
            </div>
        {/if}

        <a
            href="/admin/{account}"
            class="text-2xl p-2 rounded-2xl rounded bg-transparent border-solid border-[1px] ml-6"
        >
            Anwesenheit Laden
        </a>
    </div>
</div>

<style>
    .suggestions {
        position: absolute;
        left: 0;
        top: 40px;
        z-index: 9999;
        opacity: 0;
    }
    
    input:focus ~ .suggestions {
        opacity: 1;
    }

    .suggestions > a:last-child {
        border: none;
    }
</style>
