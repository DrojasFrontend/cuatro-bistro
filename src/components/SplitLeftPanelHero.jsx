import Image from "next/image";
import ThemeHeaderNav from "./ThemeHeaderNav";

export default function SplitLeftPanelHero({
	title = "",
	imageSrc = "/images/10I4GJR5nYsUsYnoOPIDjoapkA.webp",
	imageAlt = "Imagen destacada",
	imagePriority = true,
}) {
	return (
		<div className="split-left-panel p-3 pe-xl-0 pb-xl-3 pb-0">
			<div className="position-relative w-100 h-100 capa rounded-4 overflow-hidden" style={{ minHeight: "300px" }}>
				<Image
					src={imageSrc}
					alt={imageAlt}
					fill
					className="object-fit-cover"
					quality={100}
					priority={imagePriority}
					fetchPriority={imagePriority ? "high" : "auto"}
				/>
				<div className="d-flex flex-column justify-content-between align-items-xl-start align-items-center position-absolute bottom-0 start-0 w-100 h-100 p-xxl-5 p-xl-4 p-3">
					<ThemeHeaderNav />
					{title ? <h1 className="position-relative display-1 text-primary text-uppercase z-1">{title}</h1> : null}
				</div>
			</div>
		</div>
	);
}
