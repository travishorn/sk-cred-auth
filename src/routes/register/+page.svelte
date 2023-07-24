<script>
	/** @type {import('./$types').ActionData} */
	export let form;
</script>

{#if form?.error}
	<div>{form.error}</div>
{/if}

{#if form?.success}
	<div>You are now registered.</div>
	<a href="/sign-in">Sign in</a>
{:else}
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

		<div>
			<label for="confirmPassword">Re-type password</label>
			<input
				id="confirmPassword"
				name="confirmPassword"
				type="password"
				required
				value={form?.data?.confirmPassword || ''}
			/>
		</div>

		<button>Submit</button>
	</form>
{/if}
