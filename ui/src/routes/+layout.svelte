<script lang="ts">
    import "../app.css";
    import ClockIcon from "./clock-icon.svelte";
    import { currentTime } from "./util";

    let time = "";

    function updateTime() {
        time = currentTime();
    }

    updateTime();

    setInterval(updateTime, 1000);
</script>

<div>
    <div class="flex">
        <ClockIcon />
        <a href="/" class="text-6xl mt-20 ml-10">Anwesenheits Tracker</a>
        <div class="grow" />
        <div class="text-4xl mt-24">
            Aleph Zero Testnet <span
                class="inline-block w-7 h-7 ml-2 bg-status-good rounded-full"
            />
        </div>
        <div class="grow" />
        <div class="text-7xl mt-16 mr-20">{time}</div>
    </div>

    <div>
        <slot />
    </div>
</div>
