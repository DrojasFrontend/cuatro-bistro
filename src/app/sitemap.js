import { getSitemapEntries } from "../lib/wpgraphql";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.cuatrobistro.com";

export default async function sitemap() {
	const staticEntries = [
		{ url: "/", changeFrequency: "weekly", priority: 1 },
		{ url: "/blog", changeFrequency: "daily", priority: 0.9 },
		{ url: "/menu", changeFrequency: "weekly", priority: 0.9 },
		{ url: "/nosotros", changeFrequency: "monthly", priority: 0.8 },
		{ url: "/contacto", changeFrequency: "monthly", priority: 0.8 },
		{ url: "/cotiza-tus-eventos", changeFrequency: "weekly", priority: 0.8 },
	];

	const dynamicEntries = await getSitemapEntries();

	const merged = new Map();

	staticEntries.forEach((entry) => {
		merged.set(entry.url, {
			url: `${SITE_URL}${entry.url}`,
			lastModified: new Date(),
			changeFrequency: entry.changeFrequency,
			priority: entry.priority,
		});
	});

	dynamicEntries.forEach((entry) => {
		const path = entry?.url || "";
		if (!path) return;

		const existing = merged.get(path);
		merged.set(path, {
			url: `${SITE_URL}${path}`,
			lastModified: entry?.lastModified || existing?.lastModified || new Date(),
			changeFrequency: existing?.changeFrequency || "weekly",
			priority: existing?.priority ?? (path.startsWith("/blog") ? 0.7 : 0.8),
		});
	});

	return Array.from(merged.values());
}
