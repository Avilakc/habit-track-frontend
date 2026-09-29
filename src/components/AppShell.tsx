"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CheckIcon, HomeIcon, StatsIcon } from "./Icons";
import styles from "./AppShell.module.css";

const navItems = [
  { href: "/", label: "Today", Icon: HomeIcon },
  { href: "/stats", label: "Stats", Icon: StatsIcon },
];

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <span className={styles.brandMark}>
            <CheckIcon size={18} strokeWidth={3} />
          </span>
          <span className={styles.brandName}>habit-track</span>
        </div>

        <nav aria-label="Main" className={styles.sideNav}>
          {navItems.map(({ href, label, Icon }) => (
            <Link
              key={href}
              href={href}
              className={styles.sideLink}
              aria-current={pathname === href ? "page" : undefined}
            >
              <Icon size={20} />
              <span>{label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      <main className={styles.main}>{children}</main>

      <nav aria-label="Main" className={styles.bottomNav}>
        {navItems.map(({ href, label, Icon }) => (
          <Link
            key={href}
            href={href}
            className={styles.bottomLink}
            aria-current={pathname === href ? "page" : undefined}
          >
            <Icon />
            <span>{label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
