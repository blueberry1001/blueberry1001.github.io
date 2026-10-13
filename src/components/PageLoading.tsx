type LoadingProps = {
  appearance?: "portfolio" | "preview" | "legacy" | "standalone";
};

/** Lives inside the page shell so loading never replaces navigation. */
export default function PageLoading({
  appearance = "portfolio",
}: LoadingProps) {
  return (
    <div
      aria-live="polite"
      role="status"
      style={{
        // Keep the footer below the initial viewport while route content loads.
        minHeight:
          appearance === "standalone"
            ? "100vh"
            : appearance === "portfolio"
              ? "calc(100vh - 4rem)"
              : "55vh",
        display: "grid",
        placeItems: "center",
        padding: "3rem 1.5rem",
        background:
          appearance === "preview"
            ? "var(--preview-paper, #ffffff)"
            : appearance === "legacy"
              ? "#f6f4eb"
              : appearance === "standalone"
                ? "#006b16"
                : "#ffffff",
        color:
          appearance === "preview"
            ? "var(--preview-muted, #475569)"
            : appearance === "standalone"
              ? "#ffffff"
              : "#475569",
        fontSize: "0.875rem",
        letterSpacing: "0.04em",
      }}
    >
      <span>読み込み中…</span>
    </div>
  );
}

