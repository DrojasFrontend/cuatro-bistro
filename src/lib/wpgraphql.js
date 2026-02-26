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

function shortenExcerpt(text = "", maxLength = 220) {
  if (text.length <= maxLength) return text;

  const truncated = text.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");
  const safeCut = lastSpace > 120 ? truncated.slice(0, lastSpace) : truncated;
  return `${safeCut}...`;
}

function normalizePost(post) {
  const normalized = normalizeExcerpt(post.excerpt || "");
  const firstParagraph = normalized.split("\n\n")[0] || normalized;

  return {
    ...post,
    excerptText: shortenExcerpt(firstParagraph, 220),
    dateLabel: post.date ? new Date(post.date).toLocaleDateString("es-CO") : "",
  };
}

function toPositiveInteger(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function normalizeThemeMenuItem(item) {
  const link = item?.enlace || {};
  const title = typeof link.title === "string" ? link.title.trim() : "";
  const url = typeof link.url === "string" && link.url.trim() ? link.url.trim() : "#";
  const target = typeof link.target === "string" ? link.target.trim() : "";

  return {
    style: item?.estilo || "estilo_1",
    title,
    url,
    target,
  };
}

function normalizePlato(plato) {
  const excerptText = normalizeExcerpt(plato?.excerpt || "");
  const contentText = normalizeExcerpt(plato?.content || "");

  return {
    id: plato?.id || "",
    slug: plato?.slug || "",
    title: plato?.title || "",
    price: plato?.platoFields?.precio || "",
    detail: excerptText || contentText,
    imageUrl: plato?.featuredImage?.node?.sourceUrl || null,
  };
}

function normalizeNosotrosComponente(componente) {
  const imageNode = componente?.imagen?.node || null;

  return {
    type: componente?.fieldGroupName || "",
    title: componente?.titulo || "",
    descriptionHtml: componente?.descripcion || "",
    imagePosition: componente?.posicionImagen || "derecha",
    imageUrl: imageNode?.sourceUrl || null,
    imageAlt: imageNode?.altText || "Imagen de nosotros",
  };
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

export async function getBlogPosts({ page = 1, pageSize = 3 } = {}) {
  const safePage = toPositiveInteger(page, 1);
  const safePageSize = toPositiveInteger(pageSize, 3);
  const MAX_BLOG_POSTS = 120;

  const data = await wpFetch(
    `
      query BlogPosts($first: Int!) {
        posts(first: $first, where: { status: PUBLISH }) {
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
    {
      variables: { first: MAX_BLOG_POSTS },
      revalidate: 300,
      tags: ["posts"],
    },
  );

  const allPosts = (data?.posts?.nodes || []).map(normalizePost);
  const totalPosts = allPosts.length;
  const totalPages = Math.max(1, Math.ceil(totalPosts / safePageSize));
  const currentPage = Math.min(safePage, totalPages);
  const start = (currentPage - 1) * safePageSize;
  const end = start + safePageSize;
  const posts = allPosts.slice(start, end);

  return {
    posts,
    pagination: {
      currentPage,
      totalPages,
      pageSize: safePageSize,
      totalPosts,
      hasPrevPage: currentPage > 1,
      hasNextPage: currentPage < totalPages,
    },
  };
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

export async function getThemeMenu() {
  const data = await wpFetch(
    `
      query ThemeMenu {
        themeOptions {
          themeOptionsFields {
            menuitems {
              estilo
              enlace {
                title
                url
                target
              }
            }
          }
        }
      }
    `,
    {
      revalidate: 300,
      tags: ["theme-options"],
    },
  );

  return (data?.themeOptions?.themeOptionsFields?.menuitems || [])
    .map(normalizeThemeMenuItem)
    .filter((item) => item.title);
}

export async function getPlatos({ page = 1, pageSize = 3 } = {}) {
  const safePage = toPositiveInteger(page, 1);
  const safePageSize = toPositiveInteger(pageSize, 3);

  const data = await wpFetch(
    `
      query Platos {
        platos(first: 100, where: { status: PUBLISH }) {
          nodes {
            id
            slug
            title
            excerpt
            content
            featuredImage {
              node {
                sourceUrl
              }
            }
            platoFields {
              precio
            }
          }
        }
      }
    `,
    {
      revalidate: 300,
      tags: ["platos"],
    },
  );

  const allPlatos = (data?.platos?.nodes || []).map(normalizePlato);
  const totalPlatos = allPlatos.length;
  const totalPages = Math.max(1, Math.ceil(totalPlatos / safePageSize));
  const currentPage = Math.min(safePage, totalPages);
  const start = (currentPage - 1) * safePageSize;
  const end = start + safePageSize;
  const platos = allPlatos.slice(start, end);

  return {
    platos,
    pagination: {
      currentPage,
      totalPages,
      pageSize: safePageSize,
      totalPlatos,
      hasPrevPage: currentPage > 1,
      hasNextPage: currentPage < totalPages,
    },
  };
}

export async function getNosotrosComponentes() {
  const data = await wpFetch(
    `
      query NosotrosComponentes {
        page(id: "/nosotros", idType: URI) {
          id
          componentes {
            pageComponentsFields {
              fieldGroupName
              ... on ComponentesPageComponentsFieldsBloqueImagenTextoLayout {
                titulo
                descripcion
                posicionImagen
                imagen {
                  node {
                    sourceUrl
                    altText
                  }
                }
              }
            }
          }
        }
      }
    `,
    {
      revalidate: 300,
      tags: ["nosotros", "pages"],
    },
  );

  return (data?.page?.componentes?.pageComponentsFields || [])
    .map(normalizeNosotrosComponente)
    .filter((item) => item.title || item.descriptionHtml || item.imageUrl);
}
