<script>
	import { page } from '$app/stores';
</script>

<h1>Auth</h1>

{#if $page.data.user}
	<div>{$page.data.user.email}</div>
{/if}
