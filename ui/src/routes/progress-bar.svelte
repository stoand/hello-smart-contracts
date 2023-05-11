<script lang="ts">
    import { currentTime as utilCurrentTime, boundToHour } from "./util";

    export let timeRange: {
        start: { hour: string; minute: string };
        end: { hour: string; minute: string };
    };

    export let showTimes = true;
    export let showCurrentTime = true;
    export let height : 'tall' | 'short' = 'tall';

    let workHours: { hour: number; offset: number }[] = [];
    let workRangePixels = { start: 0, width: 0 };
    let currentTimeOffset: number;
    let currentTime = "";
    let barContainer: any;
    let barWidth: number;

    let MIN_WORK_HOUR = 8;
    let MAX_WORK_HOUR = 17;
    let HOUR_COUNT = MAX_WORK_HOUR - MIN_WORK_HOUR;

    let now: Date = new Date();

    setInterval(() => (now = new Date()), 1000);

    $: if (barContainer && timeRange) {
        if (!barWidth) {
            barWidth = barContainer.scrollWidth;
        }
        let hourOffset = barWidth / HOUR_COUNT;
        let hours = now.getHours() + now.getMinutes() / 60;

        currentTimeOffset = (hours - MIN_WORK_HOUR) * hourOffset;
        currentTime = utilCurrentTime();

        if (workHours.length == 0 && showTimes) {
            let workHoursAcc = [];

            for (let i = MIN_WORK_HOUR; i <= MAX_WORK_HOUR; i++) {
                workHoursAcc.push({
                    hour: i,
                    offset: (i - MIN_WORK_HOUR) * hourOffset,
                });
            }

            workHours = workHoursAcc;
        }

        if (timeRange.start) {
            let start = boundToHour(timeRange.start);
            workRangePixels.start = (start - MIN_WORK_HOUR) * hourOffset - 3;

            if (timeRange.end) {
                let end = boundToHour(timeRange.end);
                let offset = (end - MIN_WORK_HOUR) * hourOffset;
                workRangePixels.width = offset - workRangePixels.start;
            } else {
                workRangePixels.width =
                    currentTimeOffset - workRangePixels.start;
            }
        }
    }
</script>

<div
    bind:this={barContainer} style="height: inherit"
    class="relative border-white border-solid border-[1px]"
>
    {#each workHours as workHour}
        <div
            style="position: absolute; left: {-38 +
                workHour.offset}px; top: -40px"
            class="text-3xl"
        >
            {workHour.hour}:00
        </div>
    {/each}
    <div
        class="bg-white"
        style="height: 100%; position: absolute; left: {workRangePixels.start}px;
        width:{workRangePixels.width}px"
    />

    {#if showCurrentTime}
    <div
        style="position: absolute; left: {-44 +
            currentTimeOffset}px; bottom: -50px"
        class="text-4xl"
    >
        {currentTime}
    </div>
    {/if}
</div>
