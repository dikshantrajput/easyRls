import { writable } from "svelte/store";

export const referrerStore = writable<string | undefined>(undefined);
