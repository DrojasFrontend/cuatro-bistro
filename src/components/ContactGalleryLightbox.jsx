"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";

export default function ContactGalleryLightbox({ images = [] }) {
	const [currentIndex, setCurrentIndex] = useState(-1);
	const normalizedImages = useMemo(
		() =>
			images
				.map((image) => {
					if (typeof image === "string") {
						return { src: image, alt: "Imagen de galeria" };
					}

					return {
						src: image?.src || "",
						alt: image?.alt || "Imagen de galeria",
					};
				})
				.filter((image) => image.src),
		[images],
	);
	const slides = useMemo(() => normalizedImages.map((image) => ({ src: image.src })), [normalizedImages]);

	return (
		<>
			<div
				className="d-grid gap-3 w-100 h-100"
				style={{ gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gridAutoRows: "1fr" }}
			>
				{normalizedImages.map((image, index) => (
					<button
						key={`${image.src}-${index}`}
						type="button"
						onClick={() => setCurrentIndex(index)}
						className="p-0 border-0 bg-transparent rounded-4 overflow-hidden h-100 w-100"
						aria-label={`Abrir imagen ${index + 1} en pantalla completa`}
					>
						<div className="position-relative h-100 w-100">
							<Image
								src={image.src}
								alt={image.alt || `Imagen de galeria ${index + 1}`}
								fill
								className="object-fit-cover"
								quality={100}
								sizes="(max-width: 992px) 50vw, 25vw"
							/>
						</div>
					</button>
				))}
			</div>

			<Lightbox open={currentIndex >= 0} close={() => setCurrentIndex(-1)} index={currentIndex} slides={slides} />
		</>
	);
}
