import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { posts } from "../posts";

export default async function BlogPost({ params }) {
	const { slug } = await params;
	const post = posts.find((p) => p.slug === slug);
	if (!post) notFound();

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
						<div className="position-relative d-flex align-items-center bg-black p-2 rounded-3 gap-4 z-1">
							<Link href="/" className="font-montserrat text-primary small text-uppercase">Inicio</Link>
							<Link href="/nosotros" className="font-montserrat text-primary small text-uppercase">Nosotros</Link>
							<Link href="/blog" className="font-forum text-primary text-uppercase">Blog</Link>
							<a href="" className="font-montserrat text-primary small text-uppercase py-2 px-3 border rounded-3 bg-black-50">Reservar</a>
						</div>
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
							<p className="d-flex align-items-center font-forum gap-2 text-primary small text-uppercase m-0">{post.date}</p>
							<span className="d-inline-block border"></span>
						</div>
						<h1 className="font-forum text-primary text-uppercase mb-4 fs-1 text-center">{post.title}</h1>
						<p className="font-montserrat text-primary mb-0">{post.fullDescription}</p>
						<Link href="/blog" className="font-montserrat text-primary small text-uppercase d-inline-block mt-5">
							← Volver al blog
						</Link>
					</div>
				</div>
			</div>
		</main>
	);
}
