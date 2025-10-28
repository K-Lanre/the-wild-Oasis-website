import Header from "./_components/Header";
// import Navigation from "./_components/Navigation";
// import Logo from "./starter/components/Logo";
import "@/app/_styles/globals.css";
import { Josefin_Sans } from "next/font/google";
import { ReservationProvider } from "./_components/ReservationContext";

const josefin = Josefin_Sans({ subsets: ["latin"], display: "swap" });

export const metadata = {
  title: {
    default: "The Wild Oasis",
    template: "%s | The Wild Oasis",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${josefin.className} relative bg-primary-950 text-primary-100 antialiased min-h-screen flex flex-col`}
      >
        <Header />

        <div className="flex-1 px-8 py-12 grid">
          <main className="max-w-7xl mx-auto w-full">
            <ReservationProvider>
              {children}
            </ReservationProvider>
          </main>
        </div>
        <footer>copyright by the wild oasis</footer>
      </body>
    </html>
  );
}
