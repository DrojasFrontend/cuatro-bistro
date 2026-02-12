import Link from "next/link";

export default function Menu() {
	return (
		<main className="min-vh-100 p-4">
			<nav className="d-flex align-items-center bg-black p-2 rounded-3 gap-4 mb-4">
				<div className="p-2 border rounded-1 bg-black-50">
					<div className="position-relative px-3 py-2">
						<span className="position-absolute top-0 start-0 w-100 h-1 bg-primary" style={{ height: "1px" }}></span>
						<span className="position-absolute top-50 start-0 translate-middle-y w-100 h-1 bg-primary" style={{ height: "1px" }}></span>
						<span className="position-absolute bottom-0 start-0 w-100 h-1 bg-primary" style={{ height: "1px" }}></span>
					</div>
				</div>
				<Link href="/" className="font-forum text-primary text-uppercase">Logo</Link>
				<Link href="/nosotros" className="font-montserrat text-primary small text-uppercase">Nosotros</Link>
				<a href="" className="font-montserrat text-primary small text-uppercase py-2 px-3 border rounded-3 bg-black-50">Reservar</a>
			</nav>
			<h1>Hola mundo</h1>
		</main>
	);
}
