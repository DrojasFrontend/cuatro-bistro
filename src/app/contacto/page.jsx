import Image from "next/image";
import ContactGalleryLightbox from "../../components/ContactGalleryLightbox";
import SplitLeftPanelHero from "../../components/SplitLeftPanelHero";
import { getContactoHorario } from "../../lib/wpgraphql";

function toRows(items = [], perRow = 2) {
	const rows = [];
	for (let i = 0; i < items.length; i += perRow) {
		rows.push(items.slice(i, i + perRow));
	}
	return rows;
}

function ContactTextCard({ card }) {
	const items = card?.items || [];

	return (
		<div className="border rounded-4 px-3 py-5 h-100 w-100">
			<div className="d-flex justify-content-center align-items-center mb-4 svgTriangulo">
				<span className="d-inline-block border"></span>
				<h2 className="d-flex align-items-center font-forum gap-2 text-primary text-uppercase m-0">{card.title}</h2>
				<span className="d-inline-block border"></span>
			</div>
			<div className="d-flex flex-column gap-3">
				{items.map((item, index) => (
					<div className="d-flex align-items-start w-100 gap-2" key={`${item.text}-${item.detail}-${index}`}>
						<div className="d-flex align-items-center flex-grow-1 gap-2">
							<h3 className="font-forum small text-primary m-0 mb-2">{item.text || "-"}</h3>
							<span className="dots flex-grow-1"></span>
						</div>
						{item.option === "enlace" && item.link?.url ? (
							<a
								href={item.link.url}
								target={item.link.target || undefined}
								rel={item.link.target === "_blank" ? "noopener noreferrer" : undefined}
								className="font-montserrat text-primary small price-wrapper text-end text-decoration-none"
							>
								{item.link.title || item.link.url}
							</a>
						) : (
							<span className="font-montserrat text-primary small price-wrapper text-end">{item.detail || "-"}</span>
						)}
					</div>
				))}
			</div>
		</div>
	);
}

function ContactMapCard({ mapEmbedHtml }) {
	const mapMarkup = mapEmbedHtml || "";
	const mapIsIframeMarkup = mapMarkup.includes("<iframe");
	const mapSrc = mapMarkup && !mapIsIframeMarkup ? mapMarkup : "";

	return (
		<div className="border rounded-4 overflow-hidden h-100 w-100" style={{ minHeight: "320px" }}>
			{mapIsIframeMarkup && mapMarkup ? (
				<div className="contact-map-embed h-100 w-100" dangerouslySetInnerHTML={{ __html: mapMarkup }} />
			) : mapSrc ? (
				<iframe
					src={mapSrc}
					width="100%"
					height="100%"
					style={{ border: 0, minHeight: "320px" }}
					allowFullScreen
					loading="lazy"
					referrerPolicy="no-referrer-when-downgrade"
					title="Mapa Cuatro Bistro"
				></iframe>
			) : (
				<div className="d-flex align-items-center justify-content-center h-100 text-primary small">Sin mapa configurado</div>
			)}
		</div>
	);
}

function ContactCard({ card }) {
	if (card.style === "estilo_2") {
		return card.galleryImages?.length ? (
			<ContactGalleryLightbox images={card.galleryImages} />
		) : (
			<div className="border rounded-4 h-100 w-100 d-flex align-items-center justify-content-center text-primary small">
				Sin galeria configurada
			</div>
		);
	}

	if (card.style === "estilo_3") {
		return <ContactMapCard mapEmbedHtml={card.mapEmbedHtml || ""} />;
	}

	return <ContactTextCard card={card} />;
}

export default async function Contacto() {
	const contactoHorario = await getContactoHorario();
	const pageTitle = contactoHorario?.pageTitle || "Contacto";
	const cards = contactoHorario?.cards || [];
	const cardRows = toRows(cards, 2);

	return (
		<main className="split-main position-relative">
			<div className="position-fixed top-0 start-0 w-100 h-100 object-fit-cover capa" style={{ opacity: 0.1 }}>
				<Image
					src="/images/RAU19PL6ISblT8l98fG6ggBX9g.webp"
					alt="Imagen de inicio"
					fill
					className="object-fit-cover"
					quality={100}
				/>
			</div>
			<SplitLeftPanelHero title={pageTitle} imageAlt="Imagen de contacto" />
			<div className="split-right-panel scrollbar-hidden p-3">
				<div className="d-flex flex-column gap-3 p-0 border-0 rounded-4 h-100">
					{cardRows.map((row, rowIndex) => (
						<div className="row g-4 align-items-stretch" key={`contact-row-${rowIndex}`}>
							{row.map((card) => (
								<div
									className={row.length === 1 ? "col-12 d-flex" : "col-12 col-xl-6 d-flex"}
									key={card.id || `${card.style}-${rowIndex}`}
								>
									<ContactCard card={card} />
								</div>
							))}
						</div>
					))}
				</div>
			</div>
		</main>
	);
}
