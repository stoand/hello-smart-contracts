<script lang="ts">
    import { page } from "$app/stores";
    import Button from "./button.svelte";
    import * as Util from "../util";
    import { onMount } from "svelte";
    import { initContract, gasLimit } from "../contract";

    const MIN_WORK_HOUR = 8;
    const MAX_WORK_HOUR = 17;

    let barContainer: any;

    let workHours: { hour: number; offset: number }[] = [];
    let workRangePixels = { start: 0, width: 0 };

    let currentTime = Util.currentTime();
    let currentTimeOffset = 0;
    let status: "notStarted" | "working" | "done";
    let contract: any;

    let HOUR_COUNT = MAX_WORK_HOUR - MIN_WORK_HOUR;

    onMount(async () => {
        let hourOffset = barContainer.scrollWidth / HOUR_COUNT;

        for (let i = MIN_WORK_HOUR; i <= MAX_WORK_HOUR; i++) {
            workHours.push({
                hour: i,
                offset: (i - MIN_WORK_HOUR) * hourOffset,
            });
        }

        contract = await initContract();

        reloadContract();
        reloadTime();
        setInterval(reloadTime, 1000);
    });

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
        } else if (timeRange.start) {
            status = "working";
        } else {
            status = "notStarted";
        }

        // if (timeRange.start) {
            
        // }
    }

    function reloadTime() {
        let now = new Date();
        let hours = now.getHours()// + (now.getMinutes() / 60);
        console.log(now.getMinutes());
        let hourCount = MAX_WORK_HOUR - MIN_WORK_HOUR;
        let hourOffset = barContainer.scrollWidth / hourCount;

        currentTimeOffset = (hours - MIN_WORK_HOUR) * hourOffset;

        if (status === "working") {
            console.log(now.getMinutes());
            workRangePixels.width = currentTimeOffset - workRangePixels.start;
        }
    }

    //     barInited = true;

    //     for (let i = MIN_WORK_HOUR; i <= MAX_WORK_HOUR; i++) {
    //         workHours.push({
    //             hour: i,
    //             offset: (i - MIN_WORK_HOUR) * hourOffset,
    //         });
    //     }

    //     // to prevent state from becoming stale
    //     workHours = workHours;

    //     updateTime();
    //     reloadTimeRange();
    // }

    // function updateTime() {
    //     let now = new Date();
    //     let hours = now.getHours() + now.getMinutes() / 60;
    //     let hourCount = MAX_WORK_HOUR - MIN_WORK_HOUR;
    //     let hourOffset = barContainer.scrollWidth / hourCount;

    //     currentTimeOffset = (hours - MIN_WORK_HOUR) * hourOffset;
    // }

    // // setInterval(updateTime, 1000);

    // let account: any;
    // let contract: any;
    // let gasLimit: any;
    // type Time = { hour: number; minute: number };
    // let timeRange: { start: Time; end: Time };

    // let status: "notStarted" | "working" | "done";
    // let loading = true;

    // const ALEPH_ZERO_TESTNET_WS = "wss://ws.test.azero.dev";
    // const CONTRACT = "5CV6BooUATcJTeWF8dU3C8rscvcY6mhCoXC9NVayb1MfHbdR";
    // import CONTRACT_META from "../../contract-meta.json";

    // async function init() {
    //     await web3Enable("attendance-manager");
    //     let accounts = await web3Accounts();

    //     account = accounts.find((acc) => acc.address == $page.params.account);

    //     const wsProvider = new WsProvider(ALEPH_ZERO_TESTNET_WS);
    //     const api = await ApiPromise.create({ provider: wsProvider });

    //     contract = new ContractPromise(api, CONTRACT_META, CONTRACT);

    //     gasLimit = api.registry.createType("WeightV2", {
    //         refTime: 3912368128,
    //         proofSize: 131072,
    //     }) as any;
    // }

    // async function reloadTimeRange() {
    //     let { output } = await contract.query.getTodaysTimeRange(
    //         account.address,
    //         {
    //             gasLimit,
    //             storageDepositLimit: null,
    //         }
    //     );

    //     timeRange = output?.toHuman().Ok;

    //     if (timeRange.start && timeRange.end) {
    //         status = "done";
    //     } else if (timeRange.start) {
    //         status = "working";
    //     } else {
    //         status = "notStarted";
    //     }

    //     if (status != "notStarted") {
    //         let start = timeRange.start.hour + timeRange.start.minute / 60;
    //         let now = new Date();
    //         let end;
    //         if (timeRange.end) {
    //             end = timeRange.end.hour + timeRange.end.minute / 60;
    //         } else {
    //             end = now.getHours() + now.getMinutes() / 60;
    //         }

    //         let hourCount = MAX_WORK_HOUR - MIN_WORK_HOUR;
    //         let hourOffset = barContainer.scrollWidth / hourCount;
    //         workRangePixels.start = (workRange.start - MIN_WORK_HOUR) * hourOffset;
    //         workRangePixels.width =
    //             (workRange.end - MIN_WORK_HOUR) * hourOffset -
    //             workRangePixels.start;
    //     }

    //     loading = false;
    // }

    // init();
</script>

<div class="ml-16 mt-10">
    <div class="text-4xl">STATUS</div>

    <div class="text-5xl mt-4">Arbeitet seit 8:22</div>

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
                    workRangePixels.start}px; width:{workRangePixels.width +
                    38}px"
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
        <Button text="Tag Starten" disabled={status != "notStarted"} />
        <Button text="Tag Beenden" disabled={status != "working"} />
    </div>
</div>
