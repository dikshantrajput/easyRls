import { writable } from "svelte/store";
import { browser } from "$app/environment";
import { ThemesEnum } from "$lib/types/core";
import { THEME_LOCALSTORAGE_KEY } from "$lib/constants";

function createThemeStore() {
  const { subscribe, set } = writable(
    browser ? localStorage.getItem(THEME_LOCALSTORAGE_KEY) || ThemesEnum.LIGHT : ThemesEnum.LIGHT,
  );

  return {
    subscribe,
    set: (value: ThemesEnum) => {
      if (browser) {
        localStorage.setItem(THEME_LOCALSTORAGE_KEY, value);
      }
      set(value);
    },
    toggle() {
      if (browser) {
        const current = localStorage.getItem(THEME_LOCALSTORAGE_KEY);
        const next = current === ThemesEnum.LIGHT
          ? ThemesEnum.DARK
          : ThemesEnum.LIGHT;
        this.set(next)
      }
    },
  };
}

export const theme = createThemeStore();
