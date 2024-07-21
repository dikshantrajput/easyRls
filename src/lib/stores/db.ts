import { writable } from "svelte/store";

export const dbConnectionStringStore = writable<string | undefined>(undefined)