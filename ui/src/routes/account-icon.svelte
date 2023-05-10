<script lang="ts">
    import { polkadotIcon } from "@polkadot/ui-shared";
    
    export let accountId: string;
</script>

<svg
    class="inline-block mr-5"
    height="70"
    style="z-index: 999"
    viewBox="0 0 64 64"
    width="70"
>
    {#each polkadotIcon(accountId, { isAlternative: false }) as dot}
        <circle cx={dot.cx} cy={dot.cy} fill={dot.fill} r={dot.r} />
    {/each}
</svg>
