import { Outlet } from "react-router-dom";
import Header from "./components/Header";

interface LayoutProps {
  lang: "th" | "en";
  setLang: (lang: "th" | "en") => void;
  isLoggedIn: boolean;
}

export default function Layout({ lang, setLang, isLoggedIn }: LayoutProps) {
  return (
    <>
      <Header lang={lang} setLang={setLang} isLoggedIn={isLoggedIn} />
      <main>
        <Outlet />
      </main>
    </>
  );
}
