<script lang="ts">
    import AccountSearch from "../../account-search.svelte";
    import AccountIcon from "../../account-icon.svelte";
    import { page } from "$app/stores";
    import { initContract, account, gasLimit } from "../../contract";
    import * as Util from "../../util";

    let accountId = $page.params.account;
    let accountName: string;
    let statusMessage = "";

    let inited = false;
    let firstBar: any;
    let workdays: any = [];

    let daysOfWeek = ["Son", "Mon", "Dien", "Mitt", "Donn", "Frei", "Sam"];

    async function init() {
        let contract = await initContract(accountId);

        accountName = account.meta.name;

        let { output } = await contract.query.getWeekWorkdays(
            $page.params.account,
            {
                gasLimit,
                storageDepositLimit: null,
            },
            accountId,
            0
        );

        workdays = output?.toHuman()?.Ok;

        console.log(workdays);

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

        inited = true;
    }

    function hoursDiff(timeRange: any) {
        if (timeRange.start) {
            let end = new Date();
            
            if (timeRange.end) {
                end.setHours(timeRange.end.hour);
            }

            let hours = end.getHours() - timeRange.start.hour;

            if (hours > 0) {
                return hours + 'H';
            } else {
                return '';
            }
        } else {
            return '';
        }
    }

    function minutesDiff(timeRange: any) {
        if (timeRange.start) {
            let end = new Date();

            if (timeRange.end) {
                end.setUTCMinutes(timeRange.end.minute);
            }

            return (end.getMinutes() - timeRange.start.minute) + 'M';
            
        } else {
            return '';
        }
    }

    /// $: if (!inited && firstBar) {
    $: if (!inited) {
        init();
    }
</script>

<AccountSearch account={accountId} />

<div class="ml-16 mt-16 {inited ? '' : 'opacity-0'}">
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
            <table>
                <tbody>
                    {#each workdays as workday}
                        <tr class="text-3xl">
                            <td class="pt-10 pr-2 text-right"
                                >{workday.date.day}</td
                            >
                            <td class="pt-10 pr-2">/</td>
                            <td class="pt-10 pr-4">{workday.date.month}</td>
                            <td class="pt-10 pr-4 font-bold"
                                >{daysOfWeek[workday.weekday]}</td
                            >
                            <td class="pt-10 pr-8">todo progress bar</td>
                            <td class="pt-10 pr-6">{hoursDiff(workday.timeRange)}</td>
                            <td class="pt-10 pr-4">{minutesDiff(workday.timeRange)}</td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    </div>
</div>
