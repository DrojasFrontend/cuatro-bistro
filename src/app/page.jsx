import Image from "next/image";
import Link from "next/link";
import ThemeHeaderNav from "../components/ThemeHeaderNav";

export default async function Inicio() {
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
								src="/images/10I4GJR5nYsUsYnoOPIDjoapkA.webp"
								alt="Imagen de inicio"
								fill
								className="object-fit-cover rounded-4 overflow-hidden"
								quality={100}
							/>
              <div className="d-flex flex-column justify-content-between align-items-start position-absolute bottom-0 start-0 w-100 h-100 p-lg-5">
								<ThemeHeaderNav />
                <h1 className="position-relative display-1 text-primary text-uppercase z-1">Cuatro <br /> Bistro</h1>
              </div>
						</div>
					</div>
					<div className="col-12 col-xl-3 m-0 pe-0">
						<div className="d-flex flex-xl-column justify-content-between h-100 gap-3 pt-xl-0 pt-3">
							<Link href="/menu" className="position-relative flex-grow-1 capa d-block text-decoration-none">
								<div className="borderRadius d-flex align-items-center pt-3 pb-2">
									<span className="svgRight"></span>
									<span className="svgLeft"></span>
									<p className="font-forum text-primary text-uppercase m-0 px-4">Menu</p>
								</div>
								<Image
									src="/images/EKJJBnLQzSzsS1Sp8JrOMfZgkw.webp"
									alt="Imagen de inicio"
									fill
									className="object-fit-cover rounded-4 overflow-hidden"
									quality={100}
								/>
							</Link>
							<Link href="/nosotros" className="position-relative flex-grow-1 capa d-block text-decoration-none">
								<div className="borderRadius d-flex align-items-center pt-3 pb-2">
									<span className="svgRight"></span>
									<span className="svgLeft"></span>
									<p className="font-forum text-primary text-uppercase m-0 px-4">Nosotros</p>
								</div>
								<Image
									src="/images/slPotYXPFXAfEsa1a4GJhZIk.webp"
									alt="Imagen de inicio"
									fill
									className="object-fit-cover rounded-4 overflow-hidden"
									quality={100}
								/>
							</Link>
							<Link href="/blog" className="position-relative flex-grow-1 capa d-block text-decoration-none">
								<div className="borderRadius d-flex align-items-center pt-3 pb-2">
									<span className="svgRight"></span>
									<span className="svgLeft"></span>
									<p className="font-forum text-primary text-uppercase m-0 px-4">Blog</p>
								</div>
								<Image
									src="/images/InB1qO4eodYHQXKOVBszhLURHE.webp"
									alt="Imagen de inicio"
									fill
									className="object-fit-cover rounded-4 overflow-hidden"
									quality={100}
								/>
							</Link>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}
