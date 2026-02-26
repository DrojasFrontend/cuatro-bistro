import Image from "next/image";
import Link from "next/link";
import { getThemeMenu } from "../lib/wpgraphql";

function getMenuClasses(style) {
	if (style === "estilo_2") {
		return "font-montserrat text-primary small text-uppercase py-2 px-3 border rounded-3 bg-black-50";
	}

	return "font-montserrat text-primary small text-uppercase";
}

function isInternalUrl(url = "") {
	return url.startsWith("/");
}

export default async function ThemeHeaderNav() {
	const menuItems = await getThemeMenu();

	return (
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
			{menuItems.map((item) => {
				const className = getMenuClasses(item.style);
				const target = item.target || undefined;
				const rel = target === "_blank" ? "noopener noreferrer" : undefined;

				if (isInternalUrl(item.url) && target !== "_blank") {
					return (
						<Link key={`${item.title}-${item.url}`} href={item.url} className={className}>
							{item.title}
						</Link>
					);
				}

				return (
					<a key={`${item.title}-${item.url}`} href={item.url} target={target} rel={rel} className={className}>
						{item.title}
					</a>
				);
			})}
		</div>
	);
}
