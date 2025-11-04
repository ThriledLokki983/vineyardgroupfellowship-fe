import { useQuery } from "@tanstack/react-query";

interface DailyMessage {
  text: string;
  author?: string;
}

// Curated recovery-focused fallback messages
const LOCAL_FALLBACK: DailyMessage[] = [
  { text: "Small steps, every day.", author: "Unknown" },
  { text: "You are not your urges.", author: "Unknown" },
  { text: "Progress, not perfection.", author: "Unknown" },
  { text: "Begin again. That's strength.", author: "Unknown" },
  { text: "Recovery is not a race. You don't have to feel guilty if it takes you longer than you thought it would.", author: "Unknown" },
  { text: "Healing takes time, and asking for help is a courageous step.", author: "Mariska Hargitay" },
  { text: "You are worthy of the quiet you seek.", author: "Unknown" },
];

/**
 * Get today's date key in YYYY-MM-DD format for a given timezone
 */
function todayKey(tz = "Europe/Amsterdam"): string {
  const now = new Date();
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return fmt.format(now); // e.g., 2025-10-25
}

/**
 * Fetch daily message with multi-tier API fallback strategy
 * Gracefully handles network failures and CORS issues
 */
async function fetchDailyMessage(signal?: AbortSignal): Promise<DailyMessage> {
  const storageKey = `dailyMessage:${todayKey()}--`;

  // Check localStorage cache first
  const cached = localStorage.getItem(storageKey);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch {
      localStorage.removeItem(storageKey);
    }
  }

  let failedAPIs = 0;

  // 1) Try ZenQuotes API (free tier, requires attribution)
  // Response format: [{ q: "quote text", a: "author name", c: "character count", h: "html" }]
  try {
    const r2 = await fetch("https://zenquotes.io/api/random", { signal });
    if (r2.ok) {
      const [q] = await r2.json();
      const message: DailyMessage = { text: q.q, author: q.a };
      localStorage.setItem(storageKey, JSON.stringify(message));
      return message;
    }
  } catch (error) {
    failedAPIs++;
    if (import.meta.env.DEV && (error as Error).name !== 'AbortError') {
      console.debug("ZenQuotes API unavailable, trying fallback...");
    }
  }

  // 2) Fallback: Type.fit quotes API (static JSON, client-side random)
  // Response format: [{ text: "quote", author: "name, type" }]
  try {
    const r3 = await fetch("https://type.fit/api/quotes", { signal });
    if (r3.ok) {
      const arr = await r3.json();
      // Filter for shorter quotes for better UI fit
      const short = arr.filter((x: { text?: string }) => x?.text && x.text.length <= 160);
      if (short.length > 0) {
        const pick = short[Math.floor(Math.random() * short.length)];
        const message: DailyMessage = {
          text: pick?.text ?? LOCAL_FALLBACK[0].text,
          // Remove ", type: author" suffix if present
          author: pick?.author?.split(',')[0]?.trim() || pick?.author
        };
        localStorage.setItem(storageKey, JSON.stringify(message));
        return message;
      }
    }
  } catch (error) {
    failedAPIs++;
    if (import.meta.env.DEV && (error as Error).name !== 'AbortError') {
      console.debug("Type.fit API unavailable, using local quotes");
    }
  }

  // 4) Last resort: local curated recovery-focused messages
  // This always succeeds, ensuring users always see an encouraging message
  if (import.meta.env.DEV && failedAPIs === 3) {
    console.info("📝 Using local curated quote (external APIs unavailable)");
  }

  const message = LOCAL_FALLBACK[Math.floor(Math.random() * LOCAL_FALLBACK.length)];
  localStorage.setItem(storageKey, JSON.stringify(message));
  return message;
}

/**
 * Hook to fetch and cache a daily motivational message using TanStack Query
 * Features:
 * - Multi-tier API fallback (Quotable → ZenQuotes → Type.fit → Local)
 * - Daily caching with timezone awareness
 * - AbortSignal support for request cancellation
 * - Always returns a message (local fallback ensures success)
 */
export function useDailyMessage() {
  const { data, isLoading } = useQuery({
    queryKey: ['dailyMessage', todayKey()],
    queryFn: ({ signal }) => fetchDailyMessage(signal),
    staleTime: 24 * 60 * 60 * 1000, // 24 hours - quote is fresh all day
    gcTime: 7 * 24 * 60 * 60 * 1000, // 7 days cache retention
    refetchOnWindowFocus: false, // Don't refetch on window focus
    refetchOnMount: false, // Don't refetch on mount if data exists
    retry: false, // Don't retry - fetchDailyMessage handles all fallbacks internally
  });

  return {
    message: data ?? null,
    isLoading,
  };
}