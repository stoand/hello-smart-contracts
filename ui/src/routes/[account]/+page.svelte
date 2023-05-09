<script lang="ts">
    import { page } from "$app/stores";
    import Button from "./button.svelte";
    import * as Util from "../util";
    import { onMount } from "svelte";
    import { initContract, gasLimit, injector, account } from "../contract";

    const MIN_WORK_HOUR = 8;
    const MAX_WORK_HOUR = 17;

    let barContainer: any;

    let workHours: { hour: number; offset: number }[] = [];
    let workRangePixels = { start: 0, width: 0 };

    let currentTime = "";
    let currentTimeOffset = 0;
    let status: "notStarted" | "working" | "done";
    let statusMessage = "";
    let contract: any;
    let error = '';

    let HOUR_COUNT = MAX_WORK_HOUR - MIN_WORK_HOUR;

    let inited = false;

    $: if (barContainer && !inited) {
        (async function () {
            let hourOffset = barContainer.scrollWidth / HOUR_COUNT;

            for (let i = MIN_WORK_HOUR; i <= MAX_WORK_HOUR; i++) {
                workHours.push({
                    hour: i,
                    offset: (i - MIN_WORK_HOUR) * hourOffset,
                });
            }

            workHours = workHours;

            contract = await initContract($page.params.account);

            await reloadContract();
            await reloadTime();

            setInterval(reloadTime, 1000);

            inited = true;
        })();
    }

    type Bound = { hour: string; minute: string };

    function boundToHour(bound: Bound) {
        let now = new Date();
        now.setUTCHours(Number(bound.hour));
        now.setUTCMinutes(Number(bound.minute));
        return now.getHours() + now.getMinutes() / 60;
    }

    function boundToString(bound: Bound) {
        let now = new Date();
        now.setUTCHours(Number(bound.hour));
        now.setUTCMinutes(Number(bound.minute));

        let minutes = now.getMinutes().toString();
        if (minutes.length == 1) {
            minutes = "0" + minutes;
        }

        return `${now.getHours()}:${minutes}`;
    }

    async function reloadContract() {
        let { output } = await contract.query.getTodaysTimeRange(
            $page.params.account,
            {
                gasLimit,
                storageDepositLimit: null,
            }
        );

        let timeRange = output?.toHuman().Ok;

        if (timeRange.start && timeRange.end) {
            status = "done";
            statusMessage = "Fertig mit Arbeit";
        } else if (timeRange.start) {
            status = "working";
            statusMessage = `Arbeitet seit ${boundToString(timeRange.start)}`;
        } else {
            status = "notStarted";
            statusMessage = "Noch nicht Angefangen";
        }

        let hourCount = MAX_WORK_HOUR - MIN_WORK_HOUR;
        let hourOffset = barContainer.scrollWidth / hourCount;

        if (timeRange.start) {
            let start = boundToHour(timeRange.start);
            workRangePixels.start = (start - MIN_WORK_HOUR) * hourOffset - 3;
        }

        if (timeRange.end) {
            let end = boundToHour(timeRange.end);
            let offset = (end - MIN_WORK_HOUR) * hourOffset;
            workRangePixels.width = offset - workRangePixels.start;
        }
    }

    let x = 0;

    async function reloadTime() {
        currentTime = Util.currentTime();

        let now = new Date();
        let hours = now.getHours() + now.getMinutes() / 60;
        let hourCount = MAX_WORK_HOUR - MIN_WORK_HOUR;
        let hourOffset = barContainer.scrollWidth / hourCount;

        currentTimeOffset = (hours - MIN_WORK_HOUR) * hourOffset;

        if (status === "working") {
            workRangePixels.width = currentTimeOffset - workRangePixels.start;
        }
    }

    function handleError(err) {
        if (err.message.indexOf('1010:') === 0) {
            error = 'Bitte Tokens auf Konto Überweisen';
        } else {
            error = 'Unbekannter Fehler';
            console.error(err.message);
        }
    }

    async function startDay() {
        let processedResult = false;
        error = '';

        try {
            await contract.tx
                .startDay({
                    gasLimit,
                    storageDepositLimit: null,
                })
                .signAndSend(
                    account.address,
                    { signer: injector.signer },
                    async (result: any) => {
                        if (!processedResult && result.dispatchInfo) {
                            processedResult = true;
                            await reloadContract();
                            await reloadTime();
                        }
                    }
                );
        } catch (err) {
            handleError(err);
        }
    }

    async function endDay() {
        let processedResult = false;
        error = '';

        try {
            await contract.tx
                .endDay({
                    gasLimit,
                    storageDepositLimit: null,
                })
                .signAndSend(
                    account.address,
                    { signer: injector.signer },
                    async (result: any) => {
                        console.log('result', result);
                        if (!processedResult && result.dispatchInfo) {
                            processedResult = true;
                            await reloadContract();
                            await reloadTime();
                        }
                    }
                );
        } catch (err) {
            handleError(err);
        }
    }
</script>

<div class="ml-16 mt-10 {inited ? '' : 'opacity-0'}">
    <div class="text-4xl">STATUS</div>

    <div class="text-5xl mt-4">{statusMessage}</div>

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
                style="height: 100%; position: absolute; left: {workRangePixels.start}px;
                width:{workRangePixels.width}px"
            />

            <div
                style="position: absolute; left: {-44 +
                    currentTimeOffset}px; bottom: -50px"
                class="text-4xl"
            >
                {currentTime}
            </div>
        </div>
    </div>

    <div class="mt-20">
        <Button
            on:click={startDay}
            text="Tag Starten"
            disabled={status != "notStarted"}
        />
        <Button
            on:click={endDay}
            text="Tag Beenden"
            disabled={status != "working"}
        />
    </div>

    {#if error}
    <div class="mt-20 text-3xl">
        {error}
    </div>
    {/if}
</div>
