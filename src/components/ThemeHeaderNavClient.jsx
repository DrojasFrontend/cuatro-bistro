"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

function isInternalUrl(url = "") {
	return url.startsWith("/");
}

function getMenuClasses(style) {
	if (style === "estilo_2") {
		return "font-montserrat text-primary small text-uppercase py-2 px-3 border rounded-3 bg-black-50 text-decoration-none";
	}

	return "font-montserrat text-primary small text-uppercase d-none d-xl-inline-block text-decoration-none";
}

export default function ThemeHeaderNavClient({ menuItems = [], modalMenuItems = [] }) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<>
			<div className="position-relative d-flex align-items-center bg-black p-2 rounded-3 gap-4 z-1">
				<button
					type="button"
					className="p-2 border rounded-1 bg-black-50 menu-hamburger-button"
					onClick={() => setIsOpen(true)}
					aria-label="Abrir menu"
				>
					<div className="position-relative px-3 py-2">
						<span className="position-absolute top-0 start-0 w-100 bg-primary" style={{ height: "1px" }}></span>
						<span className="position-absolute top-50 start-0 translate-middle-y w-100 bg-primary" style={{ height: "1px" }}></span>
						<span className="position-absolute bottom-0 start-0 w-100 bg-primary" style={{ height: "1px" }}></span>
					</div>
				</button>

				<Link href="/" className="font-montserrat text-primary small text-uppercase">
					<Image src="/images/logo-cuatro-bistro-white.webp" alt="Logo" width={80} height={39} quality={100} />
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

			<div className={`modal fade ${isOpen ? "show d-block" : ""}`} tabIndex={-1} aria-hidden={!isOpen}>
				<div className="modal-dialog modal-fullscreen m-0">
					<div className="modal-content bg-black text-primary rounded-0 border-0">
						<div className="modal-header border-0 p-3">
							<button
								type="button"
								className="btn-close btn-close-white"
								aria-label="Cerrar"
								onClick={() => setIsOpen(false)}
							></button>
						</div>
						<div className="modal-body d-flex align-items-center justify-content-center">
							<nav className="d-flex flex-column align-items-center text-center gap-2">
								{modalMenuItems.map((item, index) => {
									const target = item.target || undefined;
									const rel = target === "_blank" ? "noopener noreferrer" : undefined;

									if (isInternalUrl(item.url) && target !== "_blank") {
										return (
											<Link
												key={`${item.title}-${item.url}-${index}`}
												href={item.url}
												className="menu-modal-item font-forum text-primary text-uppercase text-decoration-none"
												style={{ animationDelay: `${index * 120}ms` }}
												onClick={() => setIsOpen(false)}
											>
												{item.title}
											</Link>
										);
									}

									return (
										<a
											key={`${item.title}-${item.url}-${index}`}
											href={item.url}
											target={target}
											rel={rel}
											className="menu-modal-item font-forum text-primary text-uppercase text-decoration-none"
											style={{ animationDelay: `${index * 120}ms` }}
											onClick={() => setIsOpen(false)}
										>
											{item.title}
										</a>
									);
								})}
							</nav>
						</div>
					</div>
				</div>
			</div>

			{isOpen ? <div className="modal-backdrop fade show"></div> : null}
		</>
	);
}
