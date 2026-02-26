import Image from "next/image";
import Link from "next/link";
import ThemeHeaderNav from "../../components/ThemeHeaderNav";
import { getBlogPosts } from "../../lib/wpgraphql";

export default async function Blog({ searchParams }) {
	const resolvedSearchParams = await searchParams;
	const page = Number.parseInt(resolvedSearchParams?.page || "1", 10);
	const { posts, pagination } = await getBlogPosts({ page, pageSize: 3 });
	const pages = Array.from({ length: pagination.totalPages }, (_, index) => index + 1);

	return (
		<main className="position-relative overflow-hidden" style={{ height: "100vh" }}>
			<div className="position-fixed top-0 start-0 w-100 h-100 object-fit-cover capa" style={{ opacity: 0.1 }}>
				<Image
					src="/images/RAU19PL6ISblT8l98fG6ggBX9g.webp"
					alt="Imagen de inicio"
					fill
					className="object-fit-cover"
					quality={100}
				/>
			</div>
			<div
				className="position-fixed top-0 start-0 p-3 pe-0"
				style={{ width: "50%", height: "100vh", zIndex: 10 }}
			>
				<div className="position-relative w-100 h-100 capa rounded-4 overflow-hidden" style={{ minHeight: "300px" }}>
					<Image
						src="/images/10I4GJR5nYsUsYnoOPIDjoapkA.webp"
						alt="Imagen de inicio"
						fill
						className="object-fit-cover"
						quality={100}
					/>
					<div className="d-flex flex-column justify-content-between align-items-start position-absolute bottom-0 start-0 w-100 h-100 p-lg-5">
						<ThemeHeaderNav />
						<h1 className="position-relative display-1 text-primary text-uppercase z-1">Blog</h1>
					</div>
				</div>
			</div>
			<div
				className="position-absolute top-0 h-100 overflow-y-auto scrollbar-hidden p-3"
				style={{ width: "50%", left: "50%" }}
			>
				<div className="d-flex flex-column gap-3 p-5 border rounded-4">
					<div className="p-xl-3">
						<div className="d-flex justify-content-center align-items-center mb-4 svgTriangulo">
							<span className="d-inline-block border"></span>
							<h2 className="d-flex align-items-center font-forum gap-2 text-primary text-uppercase m-0">Últimas noticias</h2>
							<span className="d-inline-block border"></span>
						</div>
						{posts.map((post) => (
							<Link key={post.slug} href={`/blog/${post.slug}`} className="row mb-5 text-decoration-none">
								<div className="col-12 col-xl-5">
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
						<div className="d-flex justify-content-center align-items-center gap-2 mt-4 flex-wrap">
							{pagination.hasPrevPage ? (
								<Link
									href={`/blog?page=${pagination.currentPage - 1}`}
									className="font-montserrat text-primary small text-uppercase py-1 px-2 border rounded-3 bg-black-50"
								>
									Anterior
								</Link>
							) : null}
							{pages.map((pageNumber) => (
								<Link
									key={pageNumber}
									href={`/blog?page=${pageNumber}`}
									className={`font-montserrat text-primary small py-1 px-3 border rounded-3 ${pageNumber === pagination.currentPage ? "bg-black-50" : ""}`}
								>
									{pageNumber}
								</Link>
							))}
							{pagination.hasNextPage ? (
								<Link
									href={`/blog?page=${pagination.currentPage + 1}`}
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
