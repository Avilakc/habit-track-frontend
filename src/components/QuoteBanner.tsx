import { apiFetch } from "@/lib/api";
import styles from "./QuoteBanner.module.css";

interface Quote {
  quote: string;
  author: string;
}

const ONE_DAY_IN_SECONDS = 60 * 60 * 24;

async function getQuote(): Promise<Quote | null> {
  try {
    return await apiFetch<Quote>("/quote", {
      next: { revalidate: ONE_DAY_IN_SECONDS },
    });
  } catch (err) {
    console.error("Failed to load quote", err);
    return null;
  }
}

export default async function QuoteBanner() {
  const data = await getQuote();

  if (!data) return null;

  return (
    <figure className={styles.card}>
      <span className={styles.label}>Stoic quote of the day</span>
      <blockquote className={styles.quote}>
        <p>{data.quote}</p>
      </blockquote>
      <figcaption className={styles.author}>— {data.author}</figcaption>
    </figure>
  );
}
