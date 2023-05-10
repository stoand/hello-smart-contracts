<script lang="ts">
    import AccountSearch from "../../account-search.svelte";
    import AccountIcon from "../../account-icon.svelte";
    import { page } from "$app/stores";
    import { initContract, account } from "../../contract";

    let accountId = $page.params.account;
    let accountName;

    let inited = false;
    let firstBar: any;

    async function init() {
       await initContract(accountId);

       accountName = account.meta.name;

       console.log(account);

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
