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
  const postType = getPostTypeFromBody(body);

  const shouldRevalidateBlog = !postType || postType === "post";
  const shouldRevalidatePlatos = postType === "platos";

  if (shouldRevalidateBlog) {
    revalidateTag("posts");
    revalidatePath("/blog");
  }

  if (shouldRevalidatePlatos) {
    revalidateTag("platos");
    revalidatePath("/menu");
  }

  slugs.forEach((slug) => {
    if (shouldRevalidateBlog) {
      revalidateTag(`post:${slug}`);
      revalidatePath(`/blog/${slug}`);
    }
  });

  return NextResponse.json({
    revalidated: true,
    postType: postType || "post",
    slugs,
    now: Date.now(),
  });
}
