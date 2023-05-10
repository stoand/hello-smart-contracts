<script lang="ts">
    export let account = '';
</script>

<div class="ml-16">
    
    <div class="text-3xl mt-20">Konto Id</div>

    <div class="flex mt-6 ">
        <input bind:value={account} class="text-2xl p-2 rounded-2xl rounded bg-transparent border-solid border-[1px]"
            type="text" />
        <a href="/admin/{account}" class="text-2xl p-2 rounded-2xl rounded bg-transparent border-solid border-[1px] ml-6">
            Anwesenheit Laden
        </a>
    </div>
</div>
