import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

function getSlugsFromBody(body) {
  if (!body || typeof body !== "object") return [];

  const candidates = [
    body.slug,
    body.oldSlug,
    body.post?.slug,
    body.post_slug,
    body.post?.post_name,
    body.post_name,
    body.data?.slug,
  ];

  const slugsFromArray = Array.isArray(body.slugs) ? body.slugs : [];

  return [...candidates, ...slugsFromArray]
    .filter((value) => typeof value === "string" && value.trim().length > 0)
    .map((value) => value.trim())
    .filter((value, index, list) => list.indexOf(value) === index);
}

function getPathsFromBody(body) {
  if (!body || typeof body !== "object") return [];

  const candidates = [
    body.path,
    body.uri,
    body.oldPath,
    body.oldUri,
    body.post?.path,
    body.post?.uri,
    body.data?.path,
    body.data?.uri,
  ];

  const pathsFromArray = Array.isArray(body.paths) ? body.paths : [];

  return [...candidates, ...pathsFromArray]
    .filter((value) => typeof value === "string" && value.trim().length > 0)
    .map((value) => value.trim())
    .map((value) => (value.startsWith("/") ? value : `/${value}`))
    .filter((value, index, list) => list.indexOf(value) === index);
}

function getPostTypeFromBody(body) {
  if (!body || typeof body !== "object") return "";

  const candidates = [
    body.postType,
    body.post_type,
    body.post?.postType,
    body.post?.post_type,
    body.data?.postType,
    body.data?.post_type,
  ];

  const value = candidates.find((candidate) => typeof candidate === "string" && candidate.trim().length > 0);
  return value ? value.trim().toLowerCase() : "";
}

export async function POST(request) {
  const secret = request.nextUrl.searchParams.get("secret");
  const expectedSecret = process.env.REVALIDATE_SECRET;

  if (!expectedSecret) {
    return NextResponse.json({ message: "Missing REVALIDATE_SECRET on server" }, { status: 500 });
  }

  if (secret !== expectedSecret) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }

  let body = null;
  try {
    body = await request.json();
  } catch {
    body = null;
  }

  const slugs = getSlugsFromBody(body);
  const paths = getPathsFromBody(body);
  const postType = getPostTypeFromBody(body);

  const shouldRevalidateBlog = !postType || postType === "post";
  const shouldRevalidatePlatos = postType === "platos";
  const shouldRevalidatePages = postType === "page";

  if (shouldRevalidateBlog) {
    revalidateTag("posts");
    revalidatePath("/blog");
  }

  if (shouldRevalidatePlatos) {
    revalidateTag("platos");
    revalidatePath("/menu");
  }

  if (shouldRevalidatePages) {
    revalidateTag("pages");
  }

  slugs.forEach((slug) => {
    if (shouldRevalidateBlog) {
      revalidateTag(`post:${slug}`);
      revalidatePath(`/blog/${slug}`);
    }
  });

  if (shouldRevalidatePages) {
    const pagePaths = paths.length > 0 ? paths : slugs.map((slug) => `/${slug}`);
    pagePaths.forEach((path) => {
      revalidatePath(path);
    });
  }

  return NextResponse.json({
    revalidated: true,
    postType: postType || "post",
    slugs,
    paths,
    now: Date.now(),
  });
}
