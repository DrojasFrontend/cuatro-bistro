import Image from "next/image";
import ThemeHeaderNav from "../../components/ThemeHeaderNav";
import { getPlatos } from "../../lib/wpgraphql";
import { menuItems } from "./items";

export default async function Menu() {
	const platos = await getPlatos();
	const items = platos.length > 0 ? platos : menuItems;

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
						{items.map((item, index) => (
							<div key={index} className="row mb-5">
								<div className="col-12 col-xl-5">
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
					</div>
				</div>
			</div>
		</main>
	);
}
