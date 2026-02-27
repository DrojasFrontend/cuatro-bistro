import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ThemeHeaderNav from "../../components/ThemeHeaderNav";
import { getBlogPostBySlug } from "../../lib/wpgraphql";

export default async function BlogPost({ params }) {
	const { slug } = await params;
	const post = await getBlogPostBySlug(slug);
	if (!post) notFound();

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
					</div>
				</div>
			</div>
			<div className="split-right-panel scrollbar-hidden p-3">
				<div className="d-flex flex-column gap-3 p-xl-5 p-3 border rounded-4">
					<div className="p-xl-3">
						<div className="d-flex justify-content-center align-items-center mb-4 svgTriangulo">
							<span className="d-inline-block border"></span>
							<p className="d-flex align-items-center font-forum gap-2 text-primary small text-uppercase m-0">{post.dateLabel}</p>
							<span className="d-inline-block border"></span>
						</div>
						<h1 className="font-forum text-primary text-uppercase mb-4 fs-1 text-center">{post.title}</h1>
						<div
							className="font-montserrat text-primary mb-0"
							dangerouslySetInnerHTML={{ __html: post.content || "" }}
						/>
						<Link href="/blog" className="font-montserrat text-primary small text-uppercase d-inline-block mt-5">
							← Volver al blog
						</Link>
					</div>
				</div>
			</div>
		</main>
	);
}
