<script lang="ts">
    export let text: string;
    export let disabled = false;
</script>

<button
    on:click
    disabled={disabled}
    class="border-solid border-[1px] text-3xl p-10 mr-16 rounded-3xl rounded 
        {disabled ? 'text-disabled bg-disabled-transparent' : 'bg-white-transparent border-white-transparent2'}"
>
    {text}
</button>
