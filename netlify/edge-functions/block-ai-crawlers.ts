const BLOCKED_AGENTS = [
  "GPTBot",
  "ClaudeBot",
  "anthropic-ai",
  "CCBot",
  "Bytespider",
  "Meta-ExternalAgent",
  "FacebookBot",
  "Amazonbot",
  "cohere-ai",
  "Diffbot",
  "Omgilibot",
  "ImagesiftBot",
  "Timpibot",
  "PanguBot",
  "Ai2Bot",
  "webzio",
].map((agent) => agent.toLowerCase());

export default (request: Request) => {
  const userAgent = (request.headers.get("user-agent") ?? "").toLowerCase();

  if (BLOCKED_AGENTS.some((agent) => userAgent.includes(agent))) {
    return new Response("Forbidden", {
      status: 403,
      headers: { "content-type": "text/plain" },
    });
  }
};

export const config = { pattern: "^/.*\\.[pP][dD][fF]$" };
