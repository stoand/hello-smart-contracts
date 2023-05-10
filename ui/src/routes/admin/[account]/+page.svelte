<script lang="ts">
    import AccountSearch from "../../account-search.svelte";
    import AccountIcon from "../../account-icon.svelte";
    import { page } from "$app/stores";
    import { initContract, account, gasLimit } from "../../contract";
    import * as Util from "../../util";

    let accountId = $page.params.account;
    let accountName: string;
    let statusMessage = '';

    let inited = false;
    let firstBar: any;

    async function init() {
       let contract = await initContract(accountId);

       accountName = account.meta.name;

        let { output } = await contract.query.getWeekWorkdays(
            $page.params.account,
            {
                gasLimit,
                storageDepositLimit: null,
            },
            accountId, 0
        );

        let workdays = output?.toHuman()?.Ok;
       
        let timeRangeToday = workdays[0].timeRange;

        if (timeRangeToday.start && timeRangeToday.end) {
            status = "done";
            statusMessage = "Heute Fertig mit Arbeit";
        } else if (timeRangeToday.start) {
            status = "working";
            statusMessage = `Arbeitet Heute seit ${Util.boundToString(timeRangeToday.start)}`;
        } else {
            status = "notStarted";
            statusMessage = "Heute Noch nicht Angefangen";
        }

       inited = true;
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
            <AccountIcon {accountId}/>
            <div class="text-3xl pt-4">{accountName}</div>
        </div>
        <div class="text-4xl pt-2">{statusMessage}</div> 
        <div class="grow-1"></div>
        <div class="grow-1"></div>
    </div>
</div>
