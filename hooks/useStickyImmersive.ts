import { useEffect } from "react";

import * as NavigationBar from "expo-navigation-bar";

export const useStickyImmersive = () => {
  const visibility = NavigationBar.useVisibility();

  useEffect(() => {
    if (visibility === "visible") {
      const timeoutId = setTimeout(() => {
        void NavigationBar.setVisibilityAsync("hidden");
      }, 2000);

      return () => clearTimeout(timeoutId);
    }
  }, [visibility]);
};
