import { useMatch } from "@tanstack/react-router";

export function Footer() {
  const isProxy = useMatch({ from: "/proxy", shouldThrow: false });

  if (isProxy) return null;
  return (
    <footer className="flex flex-col justify-between gap-10 border-t border-text-primary/10 bg-bg-secondary/25 px-5 py-14 sm:flex-row sm:px-8 lg:px-12">
      <div className="flex flex-1 flex-col items-start justify-center gap-5">
        <span className="text-base font-black tracking-[0.08em]">AZYON</span>
        <p className="max-w-xs text-sm leading-6 text-text-secondary">
          An open-source unblocked games website built with simplicity in mind.
        </p>
      </div>
      <div className="flex gap-12 text-sm">
        <div className="flex flex-col gap-2">
          <a href="/" className="hover:text-accent-primary">
            Home
          </a>
          <a href="/games" className="hover:text-accent-primary">
            Games
          </a>
          <a href="/search" className="hover:text-accent-primary">
            Search
          </a>
        </div>

        {/* <div class="flex flex-col gap-2">
          <a href="/login" class="hover:text-accent-primary">
            Login
          </a>
          <a href="/register" class="hover:text-accent-primary">
          Register
          </a>
          <a href="/profile" class="hover:text-accent-primary">
          Profile
          </a>
          <a href="/shop" class="hover:text-accent-primary">
            Shop
          </a>
        </div> */}

        <div className="flex flex-col gap-2">
          {/* <a href="/reset" class="hover:text-accent-primary">
            Reset
          </a> */}
          <a href="/preferences" className="hover:text-accent-primary">
            Preferences
          </a>
          <a href="/privacy" className="hover:text-accent-primary">
            Privacy
          </a>
          <a href="/terms" className="hover:text-accent-primary">
            Terms
          </a>
        </div>
      </div>
    </footer>
  );
}
