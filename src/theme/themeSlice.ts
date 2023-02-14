import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "redux/store";

export interface ThemeState {
  isDarkMode: boolean;
}

const initTheme = () => {
  try {
    const storedData = window.localStorage.getItem("isDarkMode");
    if (storedData) {
      if (storedData === "true") {
        return true;
      } else if (storedData === "false") {
        return false;
      }
    }
    window.localStorage.setItem("isDarkMode", "false");
    return false;
  } catch (err) {
    return false;
  }
};

const initialState: ThemeState = {
  isDarkMode: initTheme(),
};

export const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggle: (state) => {
      try {
        window.localStorage.setItem(
          "isDarkMode",
          JSON.stringify(!state.isDarkMode)
        );
      } catch (err) {}
      state.isDarkMode = !state.isDarkMode;
    },
    enable: (state) => {
      try {
        window.localStorage.setItem("isDarkMode", "true");
      } catch (err) {}
      state.isDarkMode = true;
    },
    disable: (state) => {
      try {
        window.localStorage.setItem("isDarkMode", "false");
      } catch (err) {}
      state.isDarkMode = false;
    },
  },
});

export const selectTheme = (state: RootState) => state.theme;
