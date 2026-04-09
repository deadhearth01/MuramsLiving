/**
 * Client-side activity logger — fires a POST to /api/log-activity.
 * Fire-and-forget: never blocks the caller.
 */
export function logActivity(
  action: string,
  page: string,
  details?: string
) {
  fetch("/api/log-activity", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, page, details }),
  }).catch(() => {});
}
