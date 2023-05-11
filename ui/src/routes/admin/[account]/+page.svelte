<script lang="ts">
    import AccountSearch from "../../account-search.svelte";
    import AccountIcon from "../../account-icon.svelte";
    import ProgressBar from "../../progress-bar.svelte";
    import { page } from "$app/stores";
    import { initContract, account, gasLimit } from "../../contract";
    import * as Util from "../../util";

    let accountId = $page.params.account;
    let accountName: string;
    let statusMessage = "";

    let inited = false;
    let firstBar: any;
    let workdays: any = [];
    let contract: any;

    let status = "loading";

    let daysOfWeek = ["Son", "Mon", "Dien", "Mitt", "Donn", "Frei", "Sam"];

    let workdayOffset = 0;

    async function loadWorkdays() {
        let { output } = await contract.query.getWeekWorkdays(
            $page.params.account,
            {
                gasLimit,
                storageDepositLimit: null,
            },
            accountId,
            workdayOffset
        );

        let newWorkdays = output?.toHuman()?.Ok;
        newWorkdays[0].first = true;
        workdays = workdays.concat(newWorkdays);

        workdayOffset += 1;
    }

    async function init() {
        contract = await initContract(accountId);

        console.log('initing');

        if (!account) {
            status = "invalidAccount";
        } else {
            accountName = account.meta.name;

            await loadWorkdays();

            let timeRangeToday = workdays[0].timeRange;

            if (timeRangeToday.start && timeRangeToday.end) {
                status = "done";
                statusMessage = "Heute Fertig mit Arbeit";
            } else if (timeRangeToday.start) {
                status = "working";
                statusMessage = `Arbeitet Heute seit ${Util.boundToString(
                    timeRangeToday.start
                )}`;
            } else {
                status = "notStarted";
                statusMessage = "Heute Noch nicht Angefangen";
            }

            status = "loaded";
        }
    }

    function hoursDiff(timeRange: any) {
        if (timeRange.start) {
            let end = new Date();

            if (timeRange.end) {
                end.setHours(timeRange.end.hour);
            }

            let hours = end.getHours() - timeRange.start.hour;

            if (hours > 0) {
                return hours + "H";
            } else {
                return "";
            }
        } else {
            return "";
        }
    }

    function minutesDiff(timeRange: any) {
        if (timeRange.start) {
            let end = new Date();

            if (timeRange.end) {
                end.setUTCMinutes(timeRange.end.minute);
            }

            return end.getMinutes() - timeRange.start.minute + "M";
        } else {
            return "";
        }
    }

    page.subscribe(() => {
        init();
    });
</script>

<AccountSearch account={accountId} />

{#if status == 'invalidAccount'}
        <div class="text-4xl mt-16 ml-16">Falsches Konto Id</div>
{/if}

<div class="ml-16 mt-16 mb-16 {status == 'loaded' ? '' : 'opacity-0'}">
    <div class="flex justify-between">
        <div class="flex">
            <AccountIcon {accountId} />
            <div class="text-3xl pt-4">{accountName}</div>
        </div>
        <div class="text-4xl pt-2">{statusMessage}</div>
        <div class="grow-1" />
        <div class="grow-1" />
    </div>

    <div>
        <div>
            <table class="w-full">
                <tbody>
                    {#each workdays as workday}
                        {#if workday.first}
                        <tr>
                            <td> <br> <br> </td>
                        </tr>
                        {/if}
                        <tr class="text-3xl">
                            <td class="pt-10 pr-2 text-right"
                                >{workday.date.day}</td
                            >
                            <td class="pt-10 pr-2">/</td>
                            <td class="pt-10 pr-4">{workday.date.month}</td>
                            <td class="pt-10 pr-4 font-bold"
                                >{daysOfWeek[workday.weekday]}</td
                            >
                            <td class="pt-11 pr-8 w-full h-8">
                                <ProgressBar showTimes={workday.first == true} showCurrentTime={false} timeRange={workday.timeRange} />
                            </td>
                            <td class="pt-10 pr-6"
                                >{hoursDiff(workday.timeRange)}</td
                            >
                            <td class="pt-10 pr-8"
                                >{minutesDiff(workday.timeRange)}</td
                            >
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    </div>

    <div class="mt-16 mr-16">
        <button
            on:click={loadWorkdays}
            class="border-solid border-[1px] text-3xl p-6 rounded-3xl rounded
        bg-white-transparent border-white-transparent2">Mehr Laden</button
        >
    </div>
</div>
