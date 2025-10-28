import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default defineCloudflareConfig({
  experimental: {
    // Use KV namespace for ISR cache
    incrementalCache: "cloudflare-kv"
  }
});
