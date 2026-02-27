"use client";

import Image from "next/image";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function NosotrosGallerySwiper({ images = [], title = "Galeria" }) {
	if (!images.length) return null;

	return (
		<div className="position-relative capa d-block text-decoration-none">
			<Swiper
				modules={[Navigation, Pagination]}
				slidesPerView={1}
				spaceBetween={12}
				navigation={images.length > 1}
				pagination={{ clickable: true }}
				loop={images.length > 1}
				className="rounded-4 overflow-hidden"
			>
				{images.map((image, index) => (
					<SwiperSlide key={`${image.src}-${index}`}>
						<div className="position-relative" style={{ minHeight: "250px" }}>
							<Image
								src={image.src}
								alt={image.alt || `${title} ${index + 1}`}
								fill
								className="object-fit-cover rounded-4 overflow-hidden"
								quality={100}
							/>
						</div>
					</SwiperSlide>
				))}
			</Swiper>
		</div>
	);
}
