<script lang="ts">
  import { ModalPositionEnum } from "$lib/types/core";
  import Modal from "./Modal.svelte";
  import Icon from "@iconify/svelte";

  export let title, message, cancelText, confirmText;

  let promiseResolver: ((isConfirmed: boolean) => void) | undefined = undefined,
    showPopup = false;

  const dispatchConfirmation = () => {
    showPopup = false;
    promiseResolver && promiseResolver(true);
  };

  const dispatchCancellation = () => {
    showPopup = false;
    promiseResolver && promiseResolver(false);
  };

  export const confirmPopupOperation = () => {
    return new Promise<boolean>((resolve) => {
      promiseResolver = resolve;
      showPopup = true;
    });
  };
</script>

<Modal
  bind:open={showPopup}
  position={ModalPositionEnum.CENTRE}
  containerClass="bg-gray-800 border border-solid border-gray-600 m-3 avoid-clickoutside-on-click"
  scaleTransitionDuration={300}
>
  <div class="bg-gray-800 rounded-lg py-4 pb-6 w-full max-w-lg relative">
    <div class="mb-4 px-2 sm:px-6 flex justify-between items-center">
      <h2 class="text-lg sm:text-xl text-gray-200 font-bold">
        {title}
      </h2>
      <button
        class="text-gray-500 hover:text-gray-200 transition-colors duration-300"
        on:click={dispatchCancellation}
      >
      <Icon icon="maki:cross" />
      </button>
    </div>
    <hr class="border-gray-700 mb-4" />
    <div class="px-4 sm:px-6">
      <div class="mb-6">
        <p class="text-sm md:text-base text-gray-400">
          {message}
        </p>
      </div>
      <div
        class="flex flex-col-reverse sm:flex-row-reverse sm:flex-row gap-3 sm:gap-4"
      >
        <button
          type="button"
          class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600/50 text-sm font-medium text-white hover:bg-red-600/60 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm"
          on:click={dispatchConfirmation}
        >
          {confirmText}
        </button>
        <button
          type="button"
          class="w-full inline-flex justify-center rounded-md border border-gray-600 shadow-sm px-4 py-2 bg-gray-700 text-sm font-medium text-gray-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
          on:click={dispatchCancellation}
        >
          {cancelText}
        </button>
      </div>
    </div>
  </div>
</Modal>
