import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "./components/header";
import ReactQueryProvider from "./config/ReactQueryProvider";

const nanumSquareB = localFont({
    src: "./fonts/NanumSquareB.ttf",
    variable: "--font-nanumSquare-B",
    weight: "100 800",
});

export const metadata: Metadata = {
    title: "Create Next App",
    description: "Generated by create next app",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`w-2/3 mx-auto ${nanumSquareB.variable}`}>
                <ReactQueryProvider>
                    <Header />
                    {children}
                </ReactQueryProvider>
            </body>
        </html>
    );
}
