<script lang="ts">
    import { web3Accounts, web3Enable } from "@polkadot/extension-dapp";
    import { page } from '$app/stores';
    import { WsProvider, ApiPromise } from "@polkadot/api";
    import { keyring } from "@polkadot/ui-keyring";
    import { ContractPromise } from "@polkadot/api-contract";
    import Button from "./button.svelte";
   
    const MIN_WORK_HOUR = 8;
    const MAX_WORK_HOUR = 17;

    let barContainer: any;
    let barInited = false;

    let workHours: { hour: number; offset: number }[] = [];
    let workRange = { start: 9.1, end: 12.0 };
    let workRangePixels = { start: 0, width: 0 };

    let currentTime = 12.1;
    let currentTimeHour = '12';
    let currentTimeMinutes = '06';
    let currentTimeOffset = 0;

    $: if (barContainer && !barInited) {
        barInited = true;
        let hourCount = MAX_WORK_HOUR - MIN_WORK_HOUR;
        let hourOffset = barContainer.scrollWidth / hourCount;

        for (let i = MIN_WORK_HOUR; i <= MAX_WORK_HOUR; i++) {
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

    let account: any;
    let contract: any;
    let gasLimit: any;
    type Time = { hour: number, minute: number };
    let timeRange: { start: Time, end: Time };

    let status : 'notStarted' | 'working' | 'done' = 'notStarted';

    const ALEPH_ZERO_TESTNET_WS = "wss://ws.test.azero.dev";
    const CONTRACT = "5CV6BooUATcJTeWF8dU3C8rscvcY6mhCoXC9NVayb1MfHbdR";
    import CONTRACT_META from "../../contract-meta.json";

    async function init() {
        await web3Enable("attendance-manager");
        let accounts = await web3Accounts();

        account = accounts.find(acc => acc.address == $page.params.account);

        const wsProvider = new WsProvider(ALEPH_ZERO_TESTNET_WS);
        const api = await ApiPromise.create({ provider: wsProvider });

        contract = new ContractPromise(api, CONTRACT_META, CONTRACT);

        gasLimit = api.registry.createType("WeightV2", {
            refTime: 3912368128,
            proofSize: 131072,
        }) as any;

        reloadTimeRange();
    }

    async function reloadTimeRange() {
        let { output } = await contract.query.getTodaysTimeRange(account.address, {
            gasLimit,
            storageDepositLimit: null,
        });

        timeRange = output?.toHuman().Ok;

        if (timeRange.start && timeRange.end) {
            status = 'done';
        } else if (timeRange.start) {
            status = 'working';
        } else {
            status = 'notStarted';
        }
    }

    init();
    
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
        <Button text="Tag Starten" disabled={ status != 'notStarted'} />
        <Button text="Tag Beenden" disabled={ status != 'working' } />
    </div>
</div>
