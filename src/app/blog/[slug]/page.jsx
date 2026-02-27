import { redirect } from "next/navigation";

export default async function BlogPost({ params }) {
	const { slug } = await params;
	redirect(`/${slug}`);
}
