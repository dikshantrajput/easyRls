<script lang="ts">
    import { ModalPositionEnum } from "$lib/types/core";
	import { createEventDispatcher } from "svelte";
    import { scale } from "svelte/transition";

	export let open = false,
		preventCloseOnClickOutside = false,
		containerClass = "",
		position: ModalPositionEnum = ModalPositionEnum.RIGHT,
		wrapperClass = "",
		zIndex = "z-[100]",
		scaleTransitionDuration = 0;

	const eventDispatcher = createEventDispatcher<{
		clickOutside: undefined;
	}>();

	let positionStyleForWrapper = "",
		positionStyleForContainer = "";

	switch (position) {
		case ModalPositionEnum.CENTRE:
			positionStyleForWrapper = "items-center justify-center";
			positionStyleForContainer = "rounded-lg";
			break;
		case ModalPositionEnum.RIGHT:
			positionStyleForWrapper = "justify-end ";
			positionStyleForContainer = "rounded-l-lg h-full w-[var(--module-sidecard-width)]";
			break;
		case ModalPositionEnum.FULL_PAGE:
			positionStyleForWrapper = "items-center justify-center";
			positionStyleForContainer = "w-[98vw] h-[96vh] rounded-xl";
			break;
		case ModalPositionEnum.CUSTOM:
			positionStyleForWrapper = "";
			positionStyleForContainer = "";
			break;
	}

	const dispatchClose = () => {
		if (preventCloseOnClickOutside) return;
		open = false;
		eventDispatcher("clickOutside");
	};
</script>

<!-- DO not change this to class hiding i.e. not removing from DOM -->
{#if open}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div
		class="fixed inset-0 flex h-screen w-screen bg-transparent backdrop-blur
			{wrapperClass} 
			{zIndex}
			{positionStyleForWrapper}
		"
		in:scale={{duration: scaleTransitionDuration ?? 0}}
		out:scale={{duration: scaleTransitionDuration ?? 0}}
		on:click={dispatchClose}
	>
		<div
			class="relative max-h-screen overflow-auto default-scrollbar {containerClass} {positionStyleForContainer}"
			on:click|stopPropagation
		>
			<slot />
		</div>
	</div>
{/if}
