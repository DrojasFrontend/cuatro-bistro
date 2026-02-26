import Image from "next/image";
import Link from "next/link";
import ThemeHeaderNav from "../../components/ThemeHeaderNav";

export default async function Nosotros() {
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
						<h1 className="position-relative display-1 text-primary text-uppercase z-1">Nosotros</h1>
					</div>
				</div>
			</div>
			<div
				className="position-absolute top-0 h-100 overflow-y-auto scrollbar-hidden p-3"
				style={{ width: "50%", left: "50%" }}
			>
				<div className="d-flex flex-column gap-3">
					<div>
						<div className="row">
							<div className="col-12 col-xl-7">
								<div className="p-4 border border rounded-4 h-100">
									<h2 className="font-forum text-primary text-uppercase">Sushi Artistry Redefined</h2>
									<p className="font-montserrat text-primary mb-0 small">
										At Cuatro Bistro, we redefine sushi artistry with every dish. Our chefs create unique,
										flavorful pieces that are both beautiful and delicious.
									</p>
								</div>
							</div>
							<div className="col-12 col-xl-5">
								<div className="position-relative capa d-block text-decoration-none" style={{ minHeight: "250px" }}>
									<Image
										src="/images/EKJJBnLQzSzsS1Sp8JrOMfZgkw.webp"
										alt="Imagen de inicio"
										fill
										className="object-fit-cover rounded-4 overflow-hidden"
										quality={100}
									/>
								</div>
							</div>
						</div>
					</div>
					<div>
						<div className="row">
							<div className="col-12 col-xl-5">
								<div className="position-relative capa d-block text-decoration-none" style={{ minHeight: "250px" }}>
									<Image
										src="/images/EKJJBnLQzSzsS1Sp8JrOMfZgkw.webp"
										alt="Imagen de inicio"
										fill
										className="object-fit-cover rounded-4 overflow-hidden"
										quality={100}
									/>
								</div>
							</div>
							<div className="col-12 col-xl-7">
								<div className="p-4 border border rounded-4 h-100">
									<h2 className="font-forum text-primary text-uppercase">Sushi Artistry Redefined</h2>
									<p className="font-montserrat text-primary mb-0 small">
										At Cuatro Bistro, we redefine sushi artistry with every dish. Our chefs create unique,
										flavorful pieces that are both beautiful and delicious.
									</p>
								</div>
							</div>
						</div>
					</div>
					<div>
						<div className="row">
							<div className="col-12 col-xl-7">
								<div className="p-4 border border rounded-4 h-100">
									<h2 className="font-forum text-primary text-uppercase">Sushi Artistry Redefined</h2>
									<p className="font-montserrat text-primary mb-0 small">
										At Cuatro Bistro, we redefine sushi artistry with every dish. Our chefs create unique,
										flavorful pieces that are both beautiful and delicious.
									</p>
								</div>
							</div>
							<div className="col-12 col-xl-5">
								<div className="position-relative capa d-block text-decoration-none" style={{ minHeight: "250px" }}>
									<Image
										src="/images/EKJJBnLQzSzsS1Sp8JrOMfZgkw.webp"
										alt="Imagen de inicio"
										fill
										className="object-fit-cover rounded-4 overflow-hidden"
										quality={100}
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</main>
	);
}
