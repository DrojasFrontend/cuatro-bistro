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

  revalidateTag("posts");
  revalidatePath("/blog");

  slugs.forEach((slug) => {
    revalidateTag(`post:${slug}`);
    revalidatePath(`/blog/${slug}`);
  });

  return NextResponse.json({
    revalidated: true,
    slugs,
    now: Date.now(),
  });
}
