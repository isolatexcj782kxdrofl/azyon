import { useMatch } from "@tanstack/react-router";
import { motion } from "motion/react";
import type { IconType } from "react-icons/lib";
import {
  PiGameControllerBold,
  PiHouseBold,
  PiGearBold,
  PiDetectiveBold,
  PiMagnifyingGlassBold,
  PiArrowUpRightBold
} from "react-icons/pi";

const item = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.3
    }
  }
};

function Link(props: {
  href: string;
  icon: IconType;
  text?: string;
  label?: string;
}) {
  return (
    <motion.a
      href={props.href}
      target={/^(https?:)?\/\//.test(props.href) ? "_blank" : "_self"}
      variants={item}
      className="flex items-center gap-2 rounded-full border border-text-primary/20 px-3 py-2 transition-colors hover:border-accent-primary/60 hover:bg-accent-primary/10 hover:text-accent-primary"
      aria-label={props.label ?? props.text}
    >
      <props.icon />
      {props.text ?? ""}
    </motion.a>
  );
}

export function Header() {
  const isProxy = useMatch({ from: "/proxy", shouldThrow: false });

  if (isProxy) return null;

  return (
    <motion.nav
      className="sticky top-0 z-30 flex min-h-[4.75rem] w-full items-center justify-center border-b border-text-primary/10 bg-bg-primary/80 px-4 backdrop-blur-2xl sm:justify-between sm:px-8 lg:px-12"
      variants={{
        hidden: { opacity: 1, y: -64 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            delayChildren: 0.3,
            staggerChildren: 0.2,
            duration: 0.2
          }
        }
      }}
      initial="hidden"
      animate="visible"
    >
      <div className="flex items-center gap-5 sm:gap-9">
        <motion.a href="/" variants={item} aria-label="Home" className="group flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-primary text-lg font-black text-bg-primary shadow-[0_0_24px_rgba(255,118,92,0.28)] transition-transform group-hover:-rotate-6">A</span>
          <span className="hidden text-base font-black tracking-[0.08em] sm:inline">AZYON</span>
        </motion.a>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-text-secondary sm:gap-3">
          <Link href="/" icon={PiHouseBold} text="Home" />
          <Link href="/games" icon={PiGameControllerBold} text="Games" />
          <Link href="/proxy" icon={PiDetectiveBold} text="Access Web / AI" />
        </div>
      </div>
      <div className="hidden items-center gap-5 sm:flex">
        <form method="GET" action="/search" className="group relative flex items-center">
          <PiMagnifyingGlassBold className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary transition-colors group-focus-within:text-accent-primary" />
          <motion.input
            name="q"
            variants={item}
            className="search-input h-11 w-56 rounded-full border-2 border-text-primary/25 py-2 pl-10 pr-11 text-sm font-normal text-text-primary shadow-[0_8px_24px_rgba(0,0,0,0.22)] backdrop-blur-xl outline-none transition-all placeholder:text-text-secondary/80 hover:border-accent-secondary/50 focus:w-64 focus:border-accent-primary/70 focus:ring-2 focus:ring-accent-primary/20"
            placeholder="Search games"
            type="text"
            style={{ backgroundColor: "var(--bg-secondary)" }}
          />
          <button type="submit" aria-label="Submit search" className="absolute right-1.5 flex h-8 w-8 items-center justify-center rounded-full border border-accent-primary/70 bg-accent-primary text-bg-primary transition hover:scale-105 hover:brightness-110">
            <PiArrowUpRightBold />
          </button>
        </form>
        <Link href="/preferences" icon={PiGearBold} label="Preferences" />
      </div>
    </motion.nav>
  );
}
