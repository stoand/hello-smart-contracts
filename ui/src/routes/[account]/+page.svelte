<script lang="ts">
    const MIN_WORK_HOUR = 8;
    const MAX_WORK_HOUR = 17;

    let barContainer: any;
    let barInited = false;

    let workHours: { hour: number; offset: number } = [];
    let workRange = { start: 9.1, end: 12.0 };
    let workRangePixels = { start: 0, width: 0 };

    let currentTime = 9.1;
    let currentTimeHour = '9';
    let currentTimeMinutes = '06';
    let currentTimeOffset = 0;

    $: if (barContainer && !barInited) {
        barInited = true;
        let hourCount = MAX_WORK_HOUR - MIN_WORK_HOUR;
        let hourOffset = barContainer.scrollWidth / hourCount;

        for (let i = MIN_WORK_HOUR; i <= MAX_WORK_HOUR; i++) {
            console.log(barContainer.scrollWidth);
            workHours.push({
                hour: i,
                offset: (i - MIN_WORK_HOUR) * hourOffset,
            });
        }

        // to prevent state from becoming stale
        workHours = workHours;

        workRangePixels.start = (workRange.start - MIN_WORK_HOUR) * hourOffset;
        workRangePixels.width =
            (workRange.end - MIN_WORK_HOUR) * hourOffset -
            workRangePixels.start;

        currentTimeOffset = (currentTime - MIN_WORK_HOUR) * hourOffset;
    }
</script>

<div class="ml-16 mt-10">
    <div class="text-5xl">STATUS</div>

    <div class="text-5xl mt-10">Arbeitet seit 8:22</div>

    <div class="p-10">
        <div
            bind:this={barContainer}
            class="relative mt-16 mr-16 h-20 border-white border-solid border-[1px]"
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
                style="height: 100%; position: absolute; left: {-38 +
                    workRangePixels.start}px; width:{workRangePixels.width + 38}px"
            />

            <div
                style="position: absolute; left: {-44 +
                    currentTimeOffset}px; bottom: -50px"
                class="text-4xl"
            >
                {currentTimeHour}:{currentTimeMinutes}
            </div>
            
        </div>
    </div>

    <div class="mt-20">
        <button
            href="/asdf1234"
            class="border-white-transparent2 border-solid border-[1px] text-3xl p-10 mr-16 rounded-3xl rounded bg-white-transparent"
        >
            Tag Starten
        </button>

        <button
            disabled="disabled"
            href="/asdf1234"
            class="border-solid border-[1px] text-3xl p-10 mr-16 rounded-3xl rounded text-disabled bg-disabled-transparent"
        >
            Tag Beenden
        </button>
    </div>
</div>
