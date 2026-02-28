import Image from "next/image";
import EventQuoteForm from "../../components/EventQuoteForm";
import SplitLeftPanelHero from "../../components/SplitLeftPanelHero";
import {
	buildMetadataFromSeo,
	getPageFeaturedImageByUri,
	getPageSeoByUri,
} from "../../lib/wpgraphql";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
	const seoData = await getPageSeoByUri("/cotiza-tus-eventos");
	return buildMetadataFromSeo(seoData, {
		fallbackTitle: "Cotiza tus eventos",
		fallbackDescription: "Solicita una propuesta para tu evento en Cuatro Bistro.",
		path: "/cotiza-tus-eventos",
	});
}

export default async function CotizaTusEventosPage() {
	const featuredImage = await getPageFeaturedImageByUri("/cotiza-tus-eventos");

	return (
		<main className="split-main position-relative">
			<div className="position-fixed top-0 start-0 w-100 h-100 object-fit-cover capa" style={{ opacity: 0.1 }}>
				<Image
					src="/images/RAU19PL6ISblT8l98fG6ggBX9g.webp"
					alt="Imagen de fondo"
					fill
					className="object-fit-cover"
					quality={100}
				/>
			</div>

			<SplitLeftPanelHero
				title="Cotiza tus eventos"
				imageSrc={featuredImage.src || "/images/10I4GJR5nYsUsYnoOPIDjoapkA.webp"}
				imageAlt={featuredImage.alt || "Imagen destacada de cotiza tus eventos"}
			/>

			<div className="split-right-panel scrollbar-hidden p-3">
				<div className="d-flex flex-column gap-3 p-xl-5 p-3 border rounded-4 h-100">
					<div className="p-xl-3 h-100 d-flex flex-column justify-content-center">
						<div className="d-flex justify-content-center align-items-center mb-4 svgTriangulo">
							<span className="d-inline-block border"></span>
							<h2 className="d-flex align-items-center font-forum gap-2 text-primary text-uppercase m-0">
								Cotiza tus eventos
							</h2>
							<span className="d-inline-block border"></span>
						</div>
						<p className="font-montserrat text-primary text-center mb-4">
							Completa el formulario y te enviaremos una propuesta para tu evento.
						</p>
						<EventQuoteForm />
					</div>
				</div>
			</div>
		</main>
	);
}
