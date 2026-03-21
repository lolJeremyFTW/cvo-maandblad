import { NextRequest, NextResponse } from "next/server";

const GITHUB_OWNER = "lolJeremyFTW";
const GITHUB_REPO  = "cvo-maandblad";

// Allowed directories — AI can ONLY write here, never existing core files
const ALLOWED_PREFIXES = [
  "src/app/api/ai-generated/",
  "src/components/ai-generated/",
];

function isAllowedPath(filePath: string): boolean {
  return ALLOWED_PREFIXES.some((prefix) => filePath.startsWith(prefix));
}

export async function POST(req: NextRequest) {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    return NextResponse.json(
      { error: "GITHUB_TOKEN niet geconfigureerd in Vercel environment variables." },
      { status: 500 }
    );
  }

  const { file, content, description } = await req.json();

  if (!file || !content) {
    return NextResponse.json({ error: "file en content zijn verplicht." }, { status: 400 });
  }

  // Safety: only allow writing to ai-generated folders
  if (!isAllowedPath(file)) {
    return NextResponse.json(
      {
        error: `Niet toegestaan: AI mag alleen schrijven naar:\n${ALLOWED_PREFIXES.join("\n")}\n\nGeprobeerd: ${file}`,
      },
      { status: 403 }
    );
  }

  const apiUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${file}`;

  // Check if file already exists (need SHA to update)
  let sha: string | undefined;
  try {
    const check = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
      },
    });
    if (check.ok) {
      const existing = await check.json();
      sha = existing.sha;
    }
  } catch {
    // File doesn't exist yet — that's fine
  }

  // Commit the file
  const body: Record<string, string> = {
    message: `AI: ${description || `Add ${file}`}`,
    content: Buffer.from(content).toString("base64"),
  };
  if (sha) body.sha = sha;

  const commitRes = await fetch(apiUrl, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!commitRes.ok) {
    const err = await commitRes.text();
    return NextResponse.json({ error: `GitHub fout: ${err.slice(0, 200)}` }, { status: 500 });
  }

  const result = await commitRes.json();
  const commitUrl = result.commit?.html_url ?? `https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}`;

  return NextResponse.json({
    success: true,
    file,
    commitUrl,
    sha: result.content?.sha,
    message: `✅ ${file} gecommit. Vercel deployt nu automatisch (~30 sec).`,
  });
}
