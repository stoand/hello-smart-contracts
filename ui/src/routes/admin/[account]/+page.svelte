<script lang="ts">
    import AccountSearch from "../../account-search.svelte";
    import AccountIcon from "../../account-icon.svelte";
    import { page } from "$app/stores";

    let accountId = $page.params.account;

    let inited = false;
    let firstBar: any;

    $: if (!inited && firstBar) {
    }
</script>

<AccountSearch />

<div class="ml-16 mt-16">
    <AccountIcon {accountId}/>
</div>
