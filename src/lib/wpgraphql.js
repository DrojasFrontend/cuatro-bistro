const WPGRAPHQL_URL = process.env.WPGRAPHQL_URL;

function formatWpError(error) {
  if (typeof error === "string") return error;
  return error?.message || JSON.stringify(error);
}

function decodeHtmlEntities(text = "") {
  return text
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#039;|&apos;/gi, "'")
    .replace(/&hellip;/gi, "...")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">");
}

function stripHtml(html = "") {
  return html
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<(br|BR)\s*\/?>/g, "\n")
    .replace(/<\/(p|div|li|h1|h2|h3|h4|h5|h6)>/gi, "\n")
    .replace(/<li[^>]*>/gi, "- ")
    .replace(/<[^>]*>/g, " ")
    .replace(/\[\s*&hellip;\s*\]/gi, "...")
    .replace(/\[[^\]]+\]/g, " ")
    .replace(/#text\b/gi, " ")
    .replace(/&#x?[0-9a-f]+;/gi, " ")
    .replace(/&(?!hellip;|nbsp;|amp;|quot;|apos;|#039;|lt;|gt;)[a-z0-9#]+;/gi, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function normalizeExcerpt(html = "") {
  const cleaned = decodeHtmlEntities(
    stripHtml(html)
      .replace(/\s+\.\.\./g, "...")
      .replace(/\s+,/g, ",")
      .replace(/\s+\./g, "."),
  );

  return cleaned
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .join("\n\n");
}

export async function wpFetch(query, { variables = {}, revalidate = 300, tags = [] } = {}) {
  if (!WPGRAPHQL_URL) {
    throw new Error("Missing WPGRAPHQL_URL. Add it to .env.local");
  }

  const response = await fetch(WPGRAPHQL_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
    next: {
      revalidate,
      tags,
    },
  });

  if (!response.ok) {
    throw new Error(`WPGraphQL request failed: ${response.status} ${response.statusText}`);
  }

  const payload = await response.json();

  if (payload.errors?.length) {
    throw new Error(`WPGraphQL errors: ${payload.errors.map(formatWpError).join(" | ")}`);
  }

  return payload.data;
}

export async function getBlogPosts() {
  const data = await wpFetch(
    `
      query BlogPosts {
        posts(first: 20, where: { status: PUBLISH }) {
          nodes {
            id
            slug
            title
            date
            excerpt
            featuredImage {
              node {
                sourceUrl
              }
            }
            categories {
              nodes {
                name
                slug
              }
            }
          }
        }
      }
    `,
    { revalidate: 300, tags: ["posts"] },
  );

  return (data?.posts?.nodes || []).map((post) => ({
    ...post,
    excerptText: normalizeExcerpt(post.excerpt || ""),
    dateLabel: post.date ? new Date(post.date).toLocaleDateString("es-CO") : "",
  }));
}

export async function getBlogPostBySlug(slug) {
  const data = await wpFetch(
    `
      query BlogPostBySlug($slug: ID!) {
        post(id: $slug, idType: SLUG) {
          id
          slug
          title
          date
          content
          featuredImage {
            node {
              sourceUrl
            }
          }
          categories {
            nodes {
              name
              slug
            }
          }
        }
      }
    `,
    {
      variables: { slug },
      revalidate: 3600,
      tags: ["posts", `post:${slug}`],
    },
  );

  const post = data?.post || null;

  if (!post) return null;

  return {
    ...post,
    dateLabel: post.date ? new Date(post.date).toLocaleDateString("es-CO") : "",
  };
}
