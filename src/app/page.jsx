import Image from "next/image";
import Link from "next/link";
import ThemeHeaderNav from "../components/ThemeHeaderNav";
import { getHomeHeroGrid } from "../lib/wpgraphql";

export default async function Inicio() {
	const hero = await getHomeHeroGrid();
	const heroTitle = hero?.title || "Cuatro <br /> Bistro";
	const heroMainImage = hero?.mainImageUrl || "/images/10I4GJR5nYsUsYnoOPIDjoapkA.webp";
	const heroMainImageAlt = hero?.mainImageAlt || "Imagen de inicio";
	const cards =
		hero?.cards?.length > 0
			? hero.cards
			: [
					{
						title: "Menu",
						url: "/menu",
						target: "",
						imageUrl: "/images/pagina-menu.webp",
						imageAlt: "Menu",
					},
					{
						title: "Nosotros",
						url: "/nosotros",
						target: "",
						imageUrl: "/images/pagina-nosotros.webp",
						imageAlt: "Nosotros",
					},
					{
						title: "Blog",
						url: "/blog",
						target: "",
						imageUrl: "/images/pagina-blog.webp",
						imageAlt: "Blog",
					},
				];

	return (
		<main className="vh-100">
			<div className="position-fixed top-0 start-0 w-100 h-100 object-fit-cover capa" style={{ opacity: 0.1 }}>
				<Image
					src="/images/RAU19PL6ISblT8l98fG6ggBX9g.webp"
					alt="Imagen de inicio"
					fill
					className="object-fit-cover"
					quality={100}
				/>
			</div>
			<section className="container-fluid p-3 h-100">
				<div className="row m-0 p-0 g-3 h-100">
					<div className="col-12 col-xl-9 m-0 ps-xl-0 pe-xl-2 px-0">
						<div className="position-relative h-100 capa">
							<Image
								src={heroMainImage}
								alt={heroMainImageAlt}
								fill
								className="object-fit-cover rounded-4 overflow-hidden"
								quality={100}
							/>
              <div className="d-flex flex-column justify-content-between align-items-start position-absolute bottom-0 start-0 w-100 h-100 p-lg-5">
								<ThemeHeaderNav />
                <h1 className="position-relative display-1 text-primary text-uppercase z-1" dangerouslySetInnerHTML={{ __html: heroTitle }} />
              </div>
						</div>
					</div>
					<div className="col-12 col-xl-3 m-0 pe-0">
						<div className="d-flex flex-xl-column justify-content-between h-100 gap-3 pt-xl-0 pt-3">
							{cards.map((card, index) => {
								const href = card.url || "#";
								const target = card.target || undefined;
								const rel = target === "_blank" ? "noopener noreferrer" : undefined;
								const imageSrc = card.imageUrl || "/images/pagina-menu.webp";
								const imageAlt = card.imageAlt || card.title || "Imagen";
								const title = card.title || "Sección";
								const key = `${title}-${href}-${index}`;

								if (href.startsWith("/") && target !== "_blank") {
									return (
										<Link key={key} href={href} className="position-relative flex-grow-1 capa d-block text-decoration-none">
											<div className="borderRadius d-flex align-items-center pt-3 pb-2">
												<span className="svgRight"></span>
												<span className="svgLeft"></span>
												<p className="font-forum text-primary text-uppercase m-0 px-4">{title}</p>
											</div>
											<Image
												src={imageSrc}
												alt={imageAlt}
												fill
												className="object-fit-cover rounded-4 overflow-hidden"
												quality={100}
											/>
										</Link>
									);
								}

								return (
									<a key={key} href={href} target={target} rel={rel} className="position-relative flex-grow-1 capa d-block text-decoration-none">
										<div className="borderRadius d-flex align-items-center pt-3 pb-2">
											<span className="svgRight"></span>
											<span className="svgLeft"></span>
											<p className="font-forum text-primary text-uppercase m-0 px-4">{title}</p>
										</div>
										<Image
											src={imageSrc}
											alt={imageAlt}
											fill
											className="object-fit-cover rounded-4 overflow-hidden"
											quality={100}
										/>
									</a>
								);
							})}
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}
