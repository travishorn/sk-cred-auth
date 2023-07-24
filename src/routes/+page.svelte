<script>
	import { page } from '$app/stores';
</script>

{#if $page.data.user}
	<div>You are logged in as {$page.data.user.email}.</div>

	<form action="/sign-out" method="post">
		<button>Sign out</button>
	</form>
{:else}
	<div>You are not signed in.</div>
	<a href="/sign-in">Sign in</a>
	<a href="/register">Register</a>
{/if}
