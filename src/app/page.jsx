import Image from "next/image";
import Link from "next/link";

export default function Inicio() {
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
					<div className="col-9 m-0 ps-0">
						<div className="position-relative h-100 capa">
							<Image
								src="/images/10I4GJR5nYsUsYnoOPIDjoapkA.webp"
								alt="Imagen de inicio"
								fill
								className="object-fit-cover rounded-4 overflow-hidden"
								quality={100}
							/>
              <div className="d-flex flex-column justify-content-between align-items-start position-absolute bottom-0 start-0 w-100 h-100 p-lg-5">
								<div className="position-relative d-flex align-items-center bg-black p-2 rounded-3 gap-4 z-1">
									<div className="p-2 border rounded-1 bg-black-50 d-none">
										<div className="d-none position-relative px-3 py-2">
											<span className="position-absolute top-0 start-0 w-100 h-1 bg-primary" style={{ height: "1px" }}></span>
											<span className="position-absolute top-50 start-0 translate-middle-y w-100 h-1 bg-primary" style={{ height: "1px" }}></span>
											<span className="position-absolute bottom-0 start-0 w-100 h-1 bg-primary" style={{ height: "1px" }}></span>
										</div>
									</div>
									<Link href="/" className="font-montserrat text-primary small text-uppercase">Inicio</Link>
									<Link href="/nosotros" className="font-montserrat text-primary small text-uppercase">Nosotros</Link>
									<Link href="/blog" className="font-forum text-primary text-uppercase">Blog</Link>
									<a href="" className="font-montserrat text-primary small text-uppercase py-2 px-3 border rounded-3 bg-black-50">Reservar</a>
								</div>
                <h1 className="position-relative display-1 text-primary text-uppercase z-1">Cuatro <br /> Bistro</h1>
              </div>
						</div>
					</div>
					<div className="col-3 m-0 pe-0">
						<div className="d-flex flex-column justify-content-between h-100 gap-3">
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
