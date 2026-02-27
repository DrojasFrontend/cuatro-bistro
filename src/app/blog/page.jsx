import Image from "next/image";
import Link from "next/link";
import ThemeHeaderNav from "../../components/ThemeHeaderNav";
import { getBlogPosts } from "../../lib/wpgraphql";

export default async function Blog({ searchParams }) {
	const resolvedSearchParams = await searchParams;
	const page = Number.parseInt(resolvedSearchParams?.page || "1", 10);
	const category =
		typeof resolvedSearchParams?.category === "string"
			? resolvedSearchParams.category.trim().toLowerCase()
			: "";
	const { posts, categories, selectedCategorySlug, pagination } = await getBlogPosts({
		page,
		pageSize: 3,
		categorySlug: category,
	});
	const pages = Array.from({ length: pagination.totalPages }, (_, index) => index + 1);
	const buildBlogHref = (targetPage, targetCategory = selectedCategorySlug) => {
		const params = new URLSearchParams();
		if (targetPage > 1) params.set("page", String(targetPage));
		if (targetCategory) params.set("category", targetCategory);
		const queryString = params.toString();
		return queryString ? `/blog?${queryString}` : "/blog";
	};

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
			<div className="split-left-panel p-3 pe-xl-0 pb-xl-3 pb-0">
				<div className="position-relative w-100 h-100 capa rounded-4 overflow-hidden" style={{ minHeight: "300px" }}>
					<Image
						src="/images/10I4GJR5nYsUsYnoOPIDjoapkA.webp"
						alt="Imagen de inicio"
						fill
						className="object-fit-cover"
						quality={100}
					/>
					<div className="d-flex flex-column justify-content-between align-items-xl-start align-items-center position-absolute bottom-0 start-0 w-100 h-100 p-xxl-5 p-xl-4 p-3">
						<ThemeHeaderNav />
						<h1 className="position-relative display-1 text-primary text-uppercase z-1">Blog</h1>
					</div>
				</div>
			</div>
			<div className="split-right-panel scrollbar-hidden p-3">
				<div className="d-flex flex-column gap-3 p-xl-5 p-3 border rounded-4">
					<div className="p-xl-3">
						<div className="d-flex justify-content-center align-items-center mb-4 svgTriangulo">
							<span className="d-inline-block border"></span>
							<h2 className="d-flex align-items-center font-forum gap-2 text-primary text-uppercase m-0">Últimas noticias</h2>
							<span className="d-inline-block border"></span>
						</div>
						{categories.length > 0 ? (
							<div className="d-flex justify-content-center align-items-center gap-2 mb-4 flex-wrap">
								{categories.map((item) => (
									<Link
										key={item.slug}
										href={buildBlogHref(1, item.slug)}
										className={`font-montserrat text-primary small text-uppercase py-1 px-2 border rounded-3 text-decoration-none ${item.slug === selectedCategorySlug ? "bg-black-50" : ""}`}
									>
										{item.name}
									</Link>
								))}
							</div>
						) : null}
						{posts.map((post) => (
							<Link key={post.slug} href={`/${post.slug}`} className="row mb-5 text-decoration-none">
								<div className="col-12 col-xl-5 mb-3 mb-xl-0">
									<div className="d-block">
										<Image
											src={post.featuredImage?.node?.sourceUrl || "/images/kG0Xw2Nj7sB61VlucK8ZNwrs.webp"}
											alt={post.title}
											width={400}
											height={250}
											className="rounded-4 w-100 h-auto"
											quality={100}
										/>
									</div>
								</div>
								<div className="col-12 col-xl-7">
									<div>
										<p className="font-montserrat text-primary mb-0 small mb-2">{post.dateLabel}</p>
										<h3 className="font-forum fs-5 text-primary text-uppercase">{post.title}</h3>
										<p className="font-montserrat text-primary mb-0 small" style={{ whiteSpace: "pre-line" }}>
											{post.excerptText}
										</p>
									</div>
								</div>
							</Link>
						))}
						{posts.length === 0 ? (
							<p className="font-montserrat text-primary text-center mb-4">No hay publicaciones para esta categoría.</p>
						) : null}
						<div className="d-flex justify-content-center align-items-center gap-2 mt-4 flex-wrap">
							{pagination.hasPrevPage ? (
								<Link
									href={buildBlogHref(pagination.currentPage - 1)}
									className="font-montserrat text-primary small text-uppercase py-1 px-2 border rounded-3 bg-black-50"
								>
									Anterior
								</Link>
							) : null}
							{pages.map((pageNumber) => (
								<Link
									key={pageNumber}
									href={buildBlogHref(pageNumber)}
									className={`font-montserrat text-primary small py-1 px-3 border rounded-3 ${pageNumber === pagination.currentPage ? "bg-black-50" : ""}`}
								>
									{pageNumber}
								</Link>
							))}
							{pagination.hasNextPage ? (
								<Link
									href={buildBlogHref(pagination.currentPage + 1)}
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
