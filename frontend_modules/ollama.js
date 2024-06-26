import { loading, stopLoading } from "./dom_utils";

export { ollama }

async function ollama(content, prompt) {
    loading();
    const response = await fetch("/api/ollama", {
      method: "POST",
      body: JSON.stringify({
        content,
        prompt,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const json = await response.json()
    stopLoading();
    return json.data.response;
  }