import type { ReactNode } from "react";
import ThemeProvider from "./ThemeProvider";
import SocketProvider from "./SocketProvider";

export default function AppProviders({ children }: { children: ReactNode }) {
    return (
        <ThemeProvider>
            <SocketProvider>
                {children}
            </SocketProvider>
        </ThemeProvider>
    )
}