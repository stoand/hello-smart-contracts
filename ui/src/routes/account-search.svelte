<script lang="ts">
    export let account = "";

    export let accounts = [{name: "PeskyRabbit", address: "1"}, {name: "Artichoke", address: "1"}];
</script>

<div class="ml-16">
    <div class="text-3xl mt-20">Konto Id</div>

    <div class="flex mt-6 relative">
        <input
            bind:value={account}
            class="text-2xl p-2 rounded-2xl rounded bg-transparent border-solid border-[1px]"
            type="text"
        />
        <div
            class="suggestions text-2xl p-2 rounded-2xl rounded bg-blue border-solid border-[1px]"
        >
            {#each accounts as account}
            <a href="/admin/{account.address}" class="block border-b border-solid p-2">{account.name}</a>
            {/each}
        </div>

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
        display: none;
    }

    input:focus ~ .suggestions {
        display: block;
    }

    .suggestions > a:last-child {
        border: none; 
    }
</style>
