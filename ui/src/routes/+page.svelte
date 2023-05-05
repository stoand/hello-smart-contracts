<script lang="ts">
    import ClockIcon from "./clock-icon.svelte";

    let accounts = ['PeskyRabbit', 'Artichoke'];
</script>

<div>
    <div class="text-5xl ml-16 mt-20">Konto Auswählen</div>

    <div class="ml-16 mt-32">
        {#each accounts as account} 
            <a href="/asdf1234" class="border-solid border-white-transparent2 border-[1px] text-3xl p-10 mr-16 rounded-3xl rounded bg-white-transparent">
                (todo colors)
                {account}</a>
        {/each}
    </div>
</div>
