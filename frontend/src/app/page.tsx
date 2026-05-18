import type { HealthPayload } from "../features/types";

async function getHealth(): Promise<HealthPayload | null> {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

  try {
    const response = await fetch(`${apiBaseUrl}/health`, {
      cache: "no-store"
    });

    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch {
    return null;
  }
}

export default async function Home() {
  await getHealth();

  return (
    <main
      style={{
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        background: "#efeae2"
      }}
    >
      <iframe
        src="/background-base.html"
        title="INNEX Prototype"
        style={{
          height: "100%",
          width: "100%",
          border: "0",
          display: "block"
        }}
      />
    </main>
  );
}
