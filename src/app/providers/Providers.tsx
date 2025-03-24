import { ReactNode } from "react";
import StoreProvider from "./StoreProvider";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";

const Providers = async ({ children }: { children: ReactNode }) => {
  return (
    <StoreProvider>
      <AppRouterCacheProvider>{children}</AppRouterCacheProvider>
    </StoreProvider>
  );
};

export default Providers;
