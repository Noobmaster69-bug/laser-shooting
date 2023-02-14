import { useSelector } from "react-redux";
import { selectTheme, themeSlice } from "./themeSlice";
import { useAppDispatch } from "redux/hooks";
import { ReactNode, useCallback, useMemo } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
export * from "./themeSlice";

export function useDarkMode() {
  const { isDarkMode } = useSelector(selectTheme);
  const { actions } = themeSlice;
  const dispatch = useAppDispatch();
  const toggle = useCallback(() => {
    dispatch(actions.toggle);
  }, [dispatch, actions]);
  const enable = useCallback(() => {
    dispatch(actions.enable);
  }, [dispatch, actions]);
  const disable = useCallback(() => {
    dispatch(actions.disable);
  }, [dispatch, actions]);
  return {
    isDarkMode,
    toggle,
    enable,
    disable,
  };
}

export function ThemeWrapper({ children }: { children: ReactNode }) {
  const { isDarkMode } = useDarkMode();
  const theme = useMemo(() => {
    return createTheme({
      palette: {
        mode: isDarkMode ? "dark" : "light",
      },
    });
  }, [isDarkMode]);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
