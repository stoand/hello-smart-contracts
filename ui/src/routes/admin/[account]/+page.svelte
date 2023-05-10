<script lang="ts">
    import AccountSearch from "../../account-search.svelte";
    import AccountIcon from "../../account-icon.svelte";
    import { page } from "$app/stores";
    import { initContract, account, gasLimit } from "../../contract";

    let accountId = $page.params.account;
    let accountName: string;

    let inited = false;
    let firstBar: any;

    async function init() {
       let contract = await initContract(accountId);

       accountName = account.meta.name;

        let { output } = await contract.query.getWeekTimeRanges(
            $page.params.account,
            {
                gasLimit,
                storageDepositLimit: null,
            },
            accountId, 0
        );

        let timeRanges = output?.toHuman().Ok;

        console.log(timeRanges);

       inited = true;
    }
    
    /// $: if (!inited && firstBar) {
    $: if (!inited) {
        init();
    }

</script>

<AccountSearch />

<div class="ml-16 mt-16 {inited ? '' : 'opacity-0'}">
    <div class="flex justify-between">
        <div class="flex">
            <AccountIcon {accountId}/>
            <div class="text-3xl pt-4">{accountName}</div>
        </div>
        <div class="text-4xl pt-2">Arbeitet...</div> 
        <div class="grow-1"></div>
        <div class="grow-1"></div>
    </div>
</div>
