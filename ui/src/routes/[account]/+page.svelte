<script lang="ts">
    import { page } from "$app/stores";
    import Button from "./button.svelte";
    import ProgressBar from "../progress-bar.svelte";
    import * as Util from "../util";
    import { initContract, gasLimit, injector, account } from "../contract";

    let workHours: { hour: number; offset: number }[] = [];

    let status: "notStarted" | "working" | "done";
    let statusMessage = "";
    let contract: any;
    let error = '';
    let timeRange: any;

    let inited = false;

    $: if (!inited) {
        (async function () {
            workHours = workHours;

            contract = await initContract($page.params.account);

            await reloadContract();

            inited = true;
        })();
    }

    async function reloadContract() {
        let { output } = await contract.query.getTodaysTimeRange(
            $page.params.account,
            {
                gasLimit,
                storageDepositLimit: null,
            }
        );

        timeRange = output?.toHuman().Ok;

        if (timeRange.start && timeRange.end) {
            status = "done";
            statusMessage = "Fertig mit Arbeit";
        } else if (timeRange.start) {
            status = "working";
            statusMessage = `Arbeitet seit ${Util.boundToString(timeRange.start)}`;
        } else {
            status = "notStarted";
            statusMessage = "Noch nicht Angefangen";
        }
    }

    function handleError(err: any) {
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
                        if (!processedResult && result.dispatchInfo) {
                            processedResult = true;
                            await reloadContract();
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

    <div class="p-10 mt-16 mr-16 h-20">
        <ProgressBar {timeRange}/>
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
