<script>
	/** @type {import('./$types').ActionData} */
	export let form;
</script>

{#if form?.error}
	<div>{form.error}</div>
{/if}

<form method="post">
	<div>
		<label for="email">Email address</label>
		<input
			id="email"
			name="email"
			type="email"
			maxlength="50"
			required
			value={form?.data?.email || ''}
		/>
	</div>

	<div>
		<label for="password">Password</label>
		<input
			id="password"
			name="password"
			type="password"
			required
			value={form?.data?.password || ''}
		/>
	</div>

	<button>Sign in</button>
</form>
