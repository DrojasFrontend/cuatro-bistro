import Image from "next/image";
import SplitLeftPanelHero from "../../components/SplitLeftPanelHero";
import {
	buildMetadataFromSeo,
	getPageSeoByUri,
	getPlatos,
	getThemeFeaturedImages,
} from "../../lib/wpgraphql";
import { menuItems } from "./items";

export async function generateMetadata() {
	const seoData = await getPageSeoByUri("/menu");
	return buildMetadataFromSeo(seoData, {
		fallbackTitle: "Menú",
		fallbackDescription: "Conoce nuestras categorías y platos.",
		path: "/menu",
	});
}

export default async function Menu() {
	const { platos, categories } = await getPlatos({ page: 1, pageSize: 200 });
	const featuredImages = await getThemeFeaturedImages();
	const useFallbackItems = platos.length === 0;
	const sections = [];

	if (useFallbackItems) {
		sections.push({
			slug: "menu",
			name: "Menú",
			items: menuItems,
		});
	} else {
		const sectionMap = new Map(categories.map((category) => [category.slug, { ...category, items: [] }]));
		const uncategorizedSlug = "sin-categoria";

		platos.forEach((item) => {
			const primaryCategory = item.categories?.[0] || null;
			if (!primaryCategory) {
				if (!sectionMap.has(uncategorizedSlug)) {
					sectionMap.set(uncategorizedSlug, {
						slug: uncategorizedSlug,
						name: "Sin categoría",
						items: [],
					});
				}
				sectionMap.get(uncategorizedSlug).items.push(item);
				return;
			}

			if (!sectionMap.has(primaryCategory.slug)) {
				sectionMap.set(primaryCategory.slug, { ...primaryCategory, items: [] });
			}
			sectionMap.get(primaryCategory.slug).items.push(item);
		});

		sections.push(...Array.from(sectionMap.values()).filter((section) => section.items.length > 0));
	}

	return (
		<main className="split-main position-relative">
			<div className="position-fixed top-0 start-0 w-100 h-100 object-fit-cover capa" style={{ opacity: 0.1 }}>
				<Image
					src="/images/RAU19PL6ISblT8l98fG6ggBX9g.webp"
					alt="Imagen de inicio"
					fill
					className="object-fit-cover"
					quality={100}
				/>
			</div>
			<SplitLeftPanelHero
				title="Menú"
				imageSrc={featuredImages.menu.src || "/images/10I4GJR5nYsUsYnoOPIDjoapkA.webp"}
				imageAlt={featuredImages.menu.alt || "Imagen destacada del menu"}
			/>
			<div className="split-right-panel p-3">
				<div className="d-flex flex-column gap-3 p-xl-5 p-3 border rounded-4">
					<div className="p-xl-3">
						{sections.map((section) => (
							<div key={section.slug} className="mb-5">
								<div className="d-flex justify-content-center align-items-center mb-4 svgTriangulo">
									<span className="d-inline-block border"></span>
									<h2 className="d-flex align-items-center font-forum gap-2 text-primary text-uppercase m-0">
										{section.name}
									</h2>
									<span className="d-inline-block border"></span>
								</div>
								{section.items.map((item, index) => (
									<div key={`${section.slug}-${item.slug || index}`} className="row mb-5">
										{item.imageUrl ? (
											<div className="col-12 col-xl-5 mb-3 mb-xl-0">
												<div className="d-block">
													<Image
														src={item.imageUrl}
														alt={item.title}
														width={400}
														height={250}
														className="rounded-4 w-100 h-auto"
														quality={100}
													/>
												</div>
											</div>
										) : null}
										<div className={item.imageUrl ? "col-12 col-xl-7" : "col-12"}>
											<div className="d-flex flex-column gap-2">
												<div className="d-flex align-items-start w-100 gap-2">
													<div className="d-flex align-items-center flex-grow-1 gap-2">
														<h3 className="font-forum fs-5 text-primary text-uppercase m-0">{item.title}</h3>
														<span className="dots flex-grow-1"></span>
													</div>
													<span className="font-montserrat text-primary price-wrapper">{item.price}</span>
												</div>
												<p className="font-montserrat text-primary mb-0 small">{item.detail}</p>
											</div>
										</div>
									</div>
								))}
							</div>
						))}
					</div>
				</div>
			</div>
		</main>
	);
}
