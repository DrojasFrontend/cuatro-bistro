const WPGRAPHQL_URL = process.env.WPGRAPHQL_URL;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.cuatrobistro.com";

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

function formatDateLabel(dateValue) {
  if (!dateValue) return "";

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "";

  const parts = new Intl.DateTimeFormat("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).formatToParts(date);

  const day = parts.find((part) => part.type === "day")?.value || "";
  const rawMonth = parts.find((part) => part.type === "month")?.value || "";
  const year = parts.find((part) => part.type === "year")?.value || "";
  const month = rawMonth.replace(".", "").toUpperCase();

  if (!day || !month || !year) return "";

  return `${month} ${day}, ${year}`;
}

function normalizePost(post) {
  const normalized = normalizeExcerpt(post.excerpt || "");
  const firstParagraph = normalized.split("\n\n")[0] || normalized;

  return {
    ...post,
    excerptText: shortenExcerpt(firstParagraph, 220),
    dateLabel: formatDateLabel(post.date),
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

function normalizeOptionImage(image, fallbackAlt) {
  const sourceUrl = image?.node?.sourceUrl || image?.sourceUrl || null;
  const altText = image?.node?.altText || image?.altText || fallbackAlt;

  return {
    src: sourceUrl,
    alt: altText || fallbackAlt,
  };
}

function normalizeSeoItem(seo = {}) {
  return {
    title: seo?.title || "",
    metaDesc: seo?.metaDesc || "",
    canonical: seo?.canonical || "",
    metaKeywords: seo?.metaKeywords || "",
    opengraphTitle: seo?.opengraphTitle || "",
    opengraphDescription: seo?.opengraphDescription || "",
    opengraphImage: seo?.opengraphImage?.sourceUrl
      ? {
          url: seo.opengraphImage.sourceUrl,
          alt: seo?.opengraphImage?.altText || "",
        }
      : null,
    twitterTitle: seo?.twitterTitle || "",
    twitterDescription: seo?.twitterDescription || "",
    twitterImage: seo?.twitterImage?.sourceUrl
      ? {
          url: seo.twitterImage.sourceUrl,
          alt: seo?.twitterImage?.altText || "",
        }
      : null,
  };
}

function toSiteCanonical(urlOrPath = "") {
  if (!urlOrPath) return SITE_URL;

  if (urlOrPath.startsWith("/")) {
    return `${SITE_URL}${urlOrPath}`;
  }

  try {
    const parsed = new URL(urlOrPath);
    return `${SITE_URL}${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return SITE_URL;
  }
}

function getInternalHostnames() {
  const hostnames = new Set();

  try {
    const siteHostname = new URL(SITE_URL).hostname;
    hostnames.add(siteHostname);
    if (siteHostname.startsWith("www.")) {
      hostnames.add(siteHostname.replace(/^www\./, ""));
    } else {
      hostnames.add(`www.${siteHostname}`);
    }
  } catch {}

  try {
    hostnames.add(new URL(WPGRAPHQL_URL).hostname);
  } catch {}

  return hostnames;
}

function normalizeInternalLinksInHtml(html = "") {
  if (!html) return "";

  const internalHostnames = getInternalHostnames();

  return html.replace(/href=(["'])(.*?)\1/gi, (fullMatch, quote, hrefValue) => {
    const href = String(hrefValue || "").trim();
    if (!href) return fullMatch;

    const lowerHref = href.toLowerCase();
    if (
      href.startsWith("/") ||
      href.startsWith("#") ||
      lowerHref.startsWith("mailto:") ||
      lowerHref.startsWith("tel:") ||
      lowerHref.startsWith("javascript:")
    ) {
      return fullMatch;
    }

    let parsedUrl;
    try {
      parsedUrl = new URL(href);
    } catch {
      return fullMatch;
    }

    if (!internalHostnames.has(parsedUrl.hostname)) {
      return fullMatch;
    }

    const relativeHref = `${parsedUrl.pathname || "/"}${parsedUrl.search}${parsedUrl.hash}`;
    return `href=${quote}${relativeHref}${quote}`;
  });
}

function normalizePlato(plato) {
  const excerptText = normalizeExcerpt(plato?.excerpt || "");
  const contentText = normalizeExcerpt(plato?.content || "");
  const categories = (plato?.categoriasPlato?.nodes || [])
    .map((category) => {
      const slug = typeof category?.slug === "string" ? category.slug.trim().toLowerCase() : "";
      const name = typeof category?.name === "string" ? category.name.trim() : "";
      return { slug, name };
    })
    .filter((category) => category.slug && category.name);

  return {
    id: plato?.id || "",
    slug: plato?.slug || "",
    title: plato?.title || "",
    price: plato?.platoFields?.precio || "",
    detail: excerptText || contentText,
    imageUrl: plato?.featuredImage?.node?.sourceUrl || null,
    categories,
  };
}

function normalizeNosotrosComponente(componente) {
  const imageNode = componente?.imagen?.node || null;
  const galleryImages = (componente?.galeria?.nodes || [])
    .map((node) => ({
      src: node?.sourceUrl || "",
      alt: node?.altText || "Imagen de nosotros",
    }))
    .filter((image) => image.src);
  const galleryEnabledValue = componente?.carruselGaleria;
  const isGalleryEnabled =
    galleryEnabledValue === true ||
    (typeof galleryEnabledValue === "string" &&
      galleryEnabledValue.trim().toLowerCase() === "true");
  const cta = normalizeTarjetaLink(componente?.cta || {});
  const showGallery = isGalleryEnabled && galleryImages.length > 0;

  return {
    type: componente?.fieldGroupName || "",
    title: componente?.titulo || "",
    descriptionHtml: componente?.descripcion || "",
    imagePosition: componente?.posicionImagen || "derecha",
    imageUrl: imageNode?.sourceUrl || null,
    imageAlt: imageNode?.altText || componente?.titulo || "Imagen de nosotros",
    cta,
    showGallery,
    galleryImages,
  };
}

function normalizeHeroCard(card) {
  const imageNode = card?.imagen?.node || null;
  const link = card?.enlace || {};
  const title = typeof link.title === "string" ? link.title.trim() : "";
  const url = typeof link.url === "string" && link.url.trim() ? link.url.trim() : "#";
  const target = typeof link.target === "string" ? link.target.trim() : "";

  return {
    title,
    url,
    target,
    imageUrl: imageNode?.sourceUrl || null,
    imageAlt: imageNode?.altText || title || "Tarjeta secundaria",
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

export async function getBlogPosts({ page = 1, pageSize = 3, categorySlug = "" } = {}) {
  const safePage = toPositiveInteger(page, 1);
  const safePageSize = toPositiveInteger(pageSize, 3);
  const safeCategorySlug =
    typeof categorySlug === "string" ? categorySlug.trim().toLowerCase() : "";
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
  const categoriesMap = new Map();

  allPosts.forEach((post) => {
    (post?.categories?.nodes || []).forEach((category) => {
      const slug = typeof category?.slug === "string" ? category.slug.trim().toLowerCase() : "";
      const name = typeof category?.name === "string" ? category.name.trim() : "";
      if (!slug || !name || categoriesMap.has(slug)) return;
      categoriesMap.set(slug, { slug, name });
    });
  });

  const filteredPosts = safeCategorySlug
    ? allPosts.filter((post) =>
        (post?.categories?.nodes || []).some(
          (category) =>
            (typeof category?.slug === "string" ? category.slug.trim().toLowerCase() : "") ===
            safeCategorySlug,
        ),
      )
    : allPosts;

  const totalPosts = filteredPosts.length;
  const totalPages = Math.max(1, Math.ceil(totalPosts / safePageSize));
  const currentPage = Math.min(safePage, totalPages);
  const start = (currentPage - 1) * safePageSize;
  const end = start + safePageSize;
  const posts = filteredPosts.slice(start, end);

  return {
    posts,
    categories: Array.from(categoriesMap.values()),
    selectedCategorySlug: safeCategorySlug,
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

export async function getSitemapEntries() {
  const data = await wpFetch(
    `
      query SitemapEntries {
        posts(first: 200, where: { status: PUBLISH }) {
          nodes {
            slug
            modifiedGmt
          }
        }
        pages(first: 100, where: { status: PUBLISH }) {
          nodes {
            uri
            modifiedGmt
          }
        }
      }
    `,
    {
      revalidate: 300,
      tags: ["posts", "pages"],
    },
  );

  const postEntries = (data?.posts?.nodes || [])
    .map((post) => ({
      url: `/${post?.slug || ""}`.replace(/\/{2,}/g, "/"),
      lastModified: post?.modifiedGmt ? new Date(post.modifiedGmt) : new Date(),
    }))
    .filter((entry) => entry.url !== "/" && entry.url !== "/blog");

  const pageEntries = (data?.pages?.nodes || [])
    .map((page) => {
      const uri = typeof page?.uri === "string" ? page.uri.trim() : "";
      if (!uri) return null;

      const normalizedPath = uri.startsWith("/") ? uri : `/${uri}`;
      const cleanPath = normalizedPath.replace(/\/+$/, "") || "/";
      const path = cleanPath === "/inicio" ? "/" : cleanPath;

      return {
        url: path,
        lastModified: page?.modifiedGmt ? new Date(page.modifiedGmt) : new Date(),
      };
    })
    .filter(Boolean);

  const merged = new Map();

  [...pageEntries, ...postEntries].forEach((entry) => {
    if (!entry?.url) return;
    merged.set(entry.url, entry);
  });

  return Array.from(merged.values());
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
              altText
            }
          }
          entradas {
            imagenDestacada {
              node {
                sourceUrl
                altText
              }
            }
          }
          categories {
            nodes {
              name
              slug
            }
          }
          seo {
            title
            metaDesc
            canonical
            metaKeywords
            opengraphTitle
            opengraphDescription
            opengraphImage {
              sourceUrl
              altText
            }
            twitterTitle
            twitterDescription
            twitterImage {
              sourceUrl
              altText
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
    content: normalizeInternalLinksInHtml(post.content || ""),
    singleFeaturedImageUrl:
      post?.entradas?.imagenDestacada?.node?.sourceUrl || null,
    singleFeaturedImageAlt:
      post?.entradas?.imagenDestacada?.node?.altText ||
      post?.title ||
      "Imagen destacada del post",
    dateLabel: formatDateLabel(post.date),
  };
}

export async function getPageSeoByUri(uri = "/") {
  const safeUri = typeof uri === "string" && uri.trim() ? uri.trim() : "/";
  const data = await wpFetch(
    `
      query PageSeoByUri($uri: ID!) {
        page(id: $uri, idType: URI) {
          id
          title
          seo {
            title
            metaDesc
            canonical
            metaKeywords
            opengraphTitle
            opengraphDescription
            opengraphImage {
              sourceUrl
              altText
            }
            twitterTitle
            twitterDescription
            twitterImage {
              sourceUrl
              altText
            }
          }
        }
      }
    `,
    {
      variables: { uri: safeUri },
      revalidate: 300,
      tags: ["pages"],
    },
  );

  const page = data?.page || null;
  if (!page) return null;

  return {
    title: page?.title || "",
    seo: normalizeSeoItem(page?.seo || {}),
  };
}

export async function getPostSeoBySlug(slug = "") {
  const safeSlug = typeof slug === "string" ? slug.trim() : "";
  if (!safeSlug) return null;

  const data = await wpFetch(
    `
      query PostSeoBySlug($slug: ID!) {
        post(id: $slug, idType: SLUG) {
          id
          title
          seo {
            title
            metaDesc
            canonical
            metaKeywords
            opengraphTitle
            opengraphDescription
            opengraphImage {
              sourceUrl
              altText
            }
            twitterTitle
            twitterDescription
            twitterImage {
              sourceUrl
              altText
            }
          }
        }
      }
    `,
    {
      variables: { slug: safeSlug },
      revalidate: 300,
      tags: ["posts", `post:${safeSlug}`],
    },
  );

  const post = data?.post || null;
  if (!post) return null;

  return {
    title: post?.title || "",
    seo: normalizeSeoItem(post?.seo || {}),
  };
}

export function buildMetadataFromSeo(
  seoData,
  { fallbackTitle = "Cuatro Bistro", fallbackDescription = "", path = "/" } = {},
) {
  const seo = seoData?.seo || {};
  const pageTitle = seo?.title || fallbackTitle;
  const description = seo?.metaDesc || fallbackDescription;
  const canonical = toSiteCanonical(seo?.canonical || path);
  const keywords = typeof seo?.metaKeywords === "string"
    ? seo.metaKeywords
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
    : [];
  const openGraphImage = seo?.opengraphImage?.url || "";
  const twitterImage = seo?.twitterImage?.url || openGraphImage;

  return {
    title: pageTitle,
    description,
    keywords,
    alternates: { canonical },
    openGraph: {
      title: seo?.opengraphTitle || pageTitle,
      description: seo?.opengraphDescription || description,
      url: canonical,
      siteName: "Cuatro Bistro",
      locale: "es_CO",
      type: "website",
      images: openGraphImage
        ? [
            {
              url: openGraphImage,
              alt: seo?.opengraphImage?.alt || pageTitle,
            },
          ]
        : undefined,
    },
    twitter: {
      card: twitterImage ? "summary_large_image" : "summary",
      title: seo?.twitterTitle || pageTitle,
      description: seo?.twitterDescription || description,
      images: twitterImage ? [twitterImage] : undefined,
    },
  };
}

export async function getThemeMenu() {
  const queryUsingMenuItems = `
    query ThemeMenu {
      themeOptions {
        themeOptionsFields {
          menuItems {
            estilo
            enlace {
              title
              url
              target
            }
          }
          menuItemsModal {
            enlace {
              title
              url
              target
            }
          }
        }
      }
    }
  `;

  const queryUsingMenuitems = `
    query ThemeMenuLegacy {
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
          menuItemsModal {
            enlace {
              title
              url
              target
            }
          }
        }
      }
    }
  `;

  let data;

  try {
    data = await wpFetch(queryUsingMenuItems, {
      revalidate: 300,
      tags: ["theme-options"],
    });
  } catch {
    data = await wpFetch(queryUsingMenuitems, {
      revalidate: 300,
      tags: ["theme-options"],
    });
  }

  const fields = data?.themeOptions?.themeOptionsFields || {};
  const headerRaw = fields?.menuItems || fields?.menuitems || [];
  const modalRaw = fields?.menuItemsModal || [];

  return {
    headerItems: headerRaw.map(normalizeThemeMenuItem).filter((item) => item.title),
    modalItems: modalRaw.map(normalizeThemeMenuItem).filter((item) => item.title),
  };
}

export async function getThemeFeaturedImages() {
  const queryWithNode = `
    query ThemeFeaturedImagesWithNode {
      themeOptions {
        themeOptionsFields {
          destacadaBlog {
            node {
              sourceUrl
              altText
            }
          }
          destacadaMenu {
            node {
              sourceUrl
              altText
            }
          }
        }
      }
    }
  `;

  const queryDirect = `
    query ThemeFeaturedImagesDirect {
      themeOptions {
        themeOptionsFields {
          destacadaBlog {
            sourceUrl
            altText
          }
          destacadaMenu {
            sourceUrl
            altText
          }
        }
      }
    }
  `;

  let data;

  try {
    data = await wpFetch(queryWithNode, {
      revalidate: 300,
      tags: ["theme-options"],
    });
  } catch {
    data = await wpFetch(queryDirect, {
      revalidate: 300,
      tags: ["theme-options"],
    });
  }

  const fields = data?.themeOptions?.themeOptionsFields || {};

  return {
    blog: normalizeOptionImage(fields?.destacadaBlog, "Imagen destacada del blog"),
    menu: normalizeOptionImage(fields?.destacadaMenu, "Imagen destacada del menu"),
  };
}

export async function getPageFeaturedImageByUri(uri = "/") {
  const safeUri = typeof uri === "string" && uri.trim() ? uri.trim() : "/";

  const data = await wpFetch(
    `
      query PageFeaturedImageByUri($uri: ID!) {
        page(id: $uri, idType: URI) {
          featuredImage {
            node {
              sourceUrl
              altText
            }
          }
        }
      }
    `,
    {
      variables: { uri: safeUri },
      revalidate: 300,
      tags: ["pages"],
    },
  );

  return normalizeOptionImage(
    data?.page?.featuredImage,
    "Imagen destacada de la pagina",
  );
}

export async function getPlatos({ page = 1, pageSize = 3, categorySlug = "" } = {}) {
  const safePage = toPositiveInteger(page, 1);
  const safePageSize = toPositiveInteger(pageSize, 3);
  const safeCategorySlug =
    typeof categorySlug === "string" ? categorySlug.trim().toLowerCase() : "";

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
            categoriasPlato {
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
      revalidate: 300,
      tags: ["platos"],
    },
  );

  const allPlatos = (data?.platos?.nodes || []).map(normalizePlato);
  const categoriesMap = new Map();

  allPlatos.forEach((plato) => {
    plato.categories.forEach((category) => {
      if (categoriesMap.has(category.slug)) return;
      categoriesMap.set(category.slug, category);
    });
  });

  const filteredPlatos = safeCategorySlug
    ? allPlatos.filter((plato) =>
        plato.categories.some((category) => category.slug === safeCategorySlug),
      )
    : allPlatos;

  const totalPlatos = filteredPlatos.length;
  const totalPages = Math.max(1, Math.ceil(totalPlatos / safePageSize));
  const currentPage = Math.min(safePage, totalPages);
  const start = (currentPage - 1) * safePageSize;
  const end = start + safePageSize;
  const platos = filteredPlatos.slice(start, end);
  const categories = Array.from(categoriesMap.values());
  const selectedCategory = categories.find((category) => category.slug === safeCategorySlug) || null;

  return {
    platos,
    categories,
    selectedCategory,
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
          featuredImage {
            node {
              altText
              sourceUrl
            }
          }
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
                cta {
                  target
                  title
                  url
                }
                carruselGaleria
                galeria {
                  nodes {
                    altText
                    sourceUrl
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

  const componentes = (data?.page?.componentes?.pageComponentsFields || [])
    .map(normalizeNosotrosComponente)
    .filter(
      (item) =>
        item.title ||
        item.descriptionHtml ||
        item.imageUrl ||
        item.galleryImages.length > 0 ||
        item.cta.url,
    );

  const featuredImageNode = data?.page?.featuredImage?.node || null;
  const featuredImage = {
    src: featuredImageNode?.sourceUrl || null,
    alt: featuredImageNode?.altText || "Imagen de nosotros",
  };

  return {
    featuredImage,
    componentes,
  };
}

export async function getHomeHeroGrid() {
  const data = await wpFetch(
    `
      query HomeHeroGrid {
        homeRoot: page(id: "/", idType: URI) {
          id
          componentes {
            pageComponentsFields {
              ... on ComponentesPageComponentsFieldsBloqueHeroGridLayout {
                tituloPrincipal
                imagenPrincipal {
                  node {
                    sourceUrl
                    altText
                  }
                }
                tarjetasSecundarias {
                  enlace {
                    target
                    title
                    url
                  }
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
        homeInicio: page(id: "/inicio", idType: URI) {
          id
          componentes {
            pageComponentsFields {
              ... on ComponentesPageComponentsFieldsBloqueHeroGridLayout {
                tituloPrincipal
                imagenPrincipal {
                  node {
                    sourceUrl
                    altText
                  }
                }
                tarjetasSecundarias {
                  enlace {
                    target
                    title
                    url
                  }
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
      }
    `,
    {
      revalidate: 300,
      tags: ["home", "pages"],
    },
  );

  const selectedPage = data?.homeRoot || data?.homeInicio || null;
  const components = selectedPage?.componentes?.pageComponentsFields || [];
  const hero = components.find(
    (component) => component?.tituloPrincipal || component?.imagenPrincipal || component?.tarjetasSecundarias,
  );

  if (!hero) return null;

  const mainImageNode = hero?.imagenPrincipal?.node || null;

  return {
    title: hero?.tituloPrincipal || "",
    mainImageUrl: mainImageNode?.sourceUrl || null,
    mainImageAlt: mainImageNode?.altText || "Imagen principal",
    cards: (hero?.tarjetasSecundarias || []).map(normalizeHeroCard).filter((card) => card.title || card.imageUrl),
  };
}

function normalizeContactoGalleryImage(node = {}) {
  return {
    src: node?.sourceUrl || "",
    alt: node?.altText || "Imagen de galeria",
  };
}

function normalizeTarjetaLink(link = {}) {
  const title = typeof link?.title === "string" ? link.title.trim() : "";
  const url = typeof link?.url === "string" ? link.url.trim() : "";
  const target = typeof link?.target === "string" ? link.target.trim() : "";

  return { title, url, target };
}

function normalizeTarjetaItem(item = {}) {
  return {
    text: item?.texto?.trim?.() || "",
    option: item?.opcion?.trim?.()?.toLowerCase() || "detalle",
    detail: item?.detalle?.trim?.() || "",
    link: normalizeTarjetaLink(item?.enlace || {}),
  };
}

function normalizeTarjetaStyle(style = "") {
  return typeof style === "string" ? style.trim().toLowerCase() : "";
}

export async function getContactoHorario() {
  const data = await wpFetch(
    `
      query ContactoHorario {
        page(id: "/contacto", idType: URI) {
          id
          title
          componentes {
            pageComponentsFields {
              fieldGroupName
              ... on ComponentesPageComponentsFieldsBloqueTarjetasLayout {
                tituloPrincipal
                itemsTarjetas {
                  texto
                  opcion
                  detalle
                  enlace {
                    target
                    title
                    url
                  }
                }
                estilo
                galeria {
                  nodes {
                    altText
                    sourceUrl
                  }
                }
                mapa
              }
            }
          }
        }
      }
    `,
    {
      revalidate: 300,
      tags: ["contacto", "pages"],
    },
  );

  const page = data?.page || null;
  const components = page?.componentes?.pageComponentsFields || [];
  const cards = components.filter((component) => component?.fieldGroupName?.includes("BloqueTarjetasLayout"));
  const normalizedCards = cards
    .map((component, index) => ({
      id: `${component?.fieldGroupName || "card"}-${index}`,
      style: normalizeTarjetaStyle(component?.estilo),
      title: component?.tituloPrincipal || "",
      items: (component?.itemsTarjetas || [])
        .map(normalizeTarjetaItem)
        .filter((item) => item.text || item.detail || item.link.url),
      galleryImages: (component?.galeria?.nodes || [])
        .map(normalizeContactoGalleryImage)
        .filter((image) => image.src),
      mapEmbedHtml: component?.mapa?.trim?.() || "",
    }))
    .filter(
      (card) =>
        card.title || card.items.length > 0 || card.galleryImages.length > 0 || card.mapEmbedHtml,
    );

  return {
    pageTitle: page?.title || "",
    cards: normalizedCards,
  };
}
