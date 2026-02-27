import Image from "next/image";
import Link from "next/link";
import SplitLeftPanelHero from "../../components/SplitLeftPanelHero";
import { getPlatos, getThemeFeaturedImages } from "../../lib/wpgraphql";
import { menuItems } from "./items";

export default async function Menu({ searchParams }) {
	const resolvedSearchParams = await searchParams;
	const page = Number.parseInt(resolvedSearchParams?.page || "1", 10);
	const { platos, pagination } = await getPlatos({ page, pageSize: 3 });
	const featuredImages = await getThemeFeaturedImages();
	const useFallbackItems = platos.length === 0;
	const totalPages = useFallbackItems ? Math.max(1, Math.ceil(menuItems.length / 3)) : pagination.totalPages;
	const currentPage = useFallbackItems ? 1 : pagination.currentPage;
	const pages = Array.from({ length: totalPages }, (_, index) => index + 1);
	const fallbackItems = menuItems.slice(0, 3);
	const items = useFallbackItems ? fallbackItems : platos;

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
			<div className="split-right-panel scrollbar-hidden p-3">
				<div className="d-flex flex-column gap-3 p-xl-5 p-3 border rounded-4">
					<div className="p-xl-3">
						<div className="d-flex justify-content-center align-items-center mb-4 svgTriangulo">
							<span className="d-inline-block border"></span>
							<h2 className="d-flex align-items-center font-forum gap-2 text-primary text-uppercase m-0">Menú</h2>
							<span className="d-inline-block border"></span>
						</div>
						{items.map((item, index) => (
							<div key={index} className="row mb-5">
								<div className="col-12 col-xl-5 mb-3 mb-xl-0">
									<div className="d-block">
										<Image
											src={item.imageUrl || "/images/kG0Xw2Nj7sB61VlucK8ZNwrs.webp"}
											alt={item.title}
											width={400}
											height={250}
											className="rounded-4 w-100 h-auto"
											quality={100}
										/>
									</div>
								</div>
								<div className="col-12 col-xl-7">
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
						<div className="d-flex justify-content-center align-items-center gap-2 mt-4 flex-wrap">
							{!useFallbackItems && pagination.hasPrevPage ? (
								<Link
									href={`/menu?page=${pagination.currentPage - 1}`}
									className="font-montserrat text-primary small text-uppercase py-1 px-2 border rounded-3 bg-black-50"
								>
									Anterior
								</Link>
							) : null}
							{pages.map((pageNumber) => (
								<Link
									key={pageNumber}
									href={`/menu?page=${pageNumber}`}
									className={`font-montserrat text-primary small py-1 px-3 border rounded-3 ${pageNumber === currentPage ? "bg-black-50" : ""}`}
								>
									{pageNumber}
								</Link>
							))}
							{!useFallbackItems && pagination.hasNextPage ? (
								<Link
									href={`/menu?page=${pagination.currentPage + 1}`}
									className="font-montserrat text-primary small text-uppercase py-1 px-2 border rounded-3 bg-black-50"
								>
									Siguiente
								</Link>
							) : null}
						</div>
					</div>
				</div>
			</div>
		</main>
	);
}
