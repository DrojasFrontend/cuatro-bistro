import Image from "next/image";
import Link from "next/link";
import { menuItems } from "./items";

export default function Menu() {
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
							<div className="p-2 border rounded-1 bg-black-50">
								<div className="position-relative px-3 py-2">
									<span className="position-absolute top-0 start-0 w-100 h-1 bg-primary" style={{ height: "1px" }}></span>
									<span className="position-absolute top-50 start-0 translate-middle-y w-100 h-1 bg-primary" style={{ height: "1px" }}></span>
									<span className="position-absolute bottom-0 start-0 w-100 h-1 bg-primary" style={{ height: "1px" }}></span>
								</div>
							</div>
							<Link href="/" className="font-montserrat text-primary small text-uppercase">
								<Image src="/images/logo-cuatro-bistro-white.webp" alt="Logo" width={80} height={39} className="" quality={100} />
							</Link>
							<Link href="/nosotros" className="font-montserrat text-primary small text-uppercase">Nosotros</Link>
							<Link href="/blog" className="font-forum text-primary text-uppercase">Blog</Link>
							<a href="" className="font-montserrat text-primary small text-uppercase py-2 px-3 border rounded-3 bg-black-50">Reservar</a>
						</div>
						<h1 className="position-relative display-1 text-primary text-uppercase z-1">Menú</h1>
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
							<h2 className="d-flex align-items-center font-forum gap-2 text-primary text-uppercase m-0">Menú</h2>
							<span className="d-inline-block border"></span>
						</div>
						{menuItems.map((item, index) => (
							<div key={index} className="row mb-5">
								<div className="col-12 col-xl-5">
									<div className="d-block">
										<Image
											src="/images/kG0Xw2Nj7sB61VlucK8ZNwrs.webp"
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
					</div>
				</div>
			</div>
		</main>
	);
}
