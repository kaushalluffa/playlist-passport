<script>
	export let data;
	$: spotify = data?.spotify;
	$: ytMusic = data?.ytMusic;
</script>

<div class="flex justify-center items-center h-screen bg-gray-100">
	<div class="text-center">
		<div class="flex flex-col justify-center gap-4">
			<a
				class="px-4 py-2 border w-full border-gray-300 rounded hover:bg-gray-200"
				href="/api/connects/spotify/login"
				rel="noopener noreferrer"
			>
				{#if spotify && spotify?.connected}
					{spotify?.display_name} from Spotify Connected
				{:else}
					Connect Spotify
				{/if}
			</a>
			<a
				class="px-4 py-2 border w-full border-gray-300 rounded hover:bg-gray-200"
				href="/api/connects/google/login"
				rel="noopener noreferrer"
			>
				{#if ytMusic && ytMusic?.connected}
					{ytMusic?.display_name} from YTMusic Connected
				{:else}
					Connect YTMusic
				{/if}
			</a>
		</div>
	</div>
</div>
