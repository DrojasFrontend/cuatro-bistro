import Image from "next/image";
import { getThemeSocialLinks } from "../lib/wpgraphql";

export default async function SocialLinksBadgeBar({ links = [] }) {
	const socialLinks = links.length ? links : await getThemeSocialLinks();
	if (!socialLinks.length) return null;

	return (
		<div className="borderRadius d-flex align-items-center py-2">
			<span className="svgRight"></span>
			<span className="svgLeft"></span>
			<div className="d-flex align-items-center gap-2 px-3">
				{socialLinks.map((item, index) => {
					const href = item?.url || "";
					const iconUrl = item?.iconUrl || "";
					if (!href || !iconUrl) return null;

					const target = item?.target || "_blank";
					const rel = target === "_blank" ? "noopener noreferrer" : undefined;
					const label = item?.title || "Red social";
					const key = `${label}-${href}-${index}`;

					return (
						<a
							key={key}
							href={href}
							target={target}
							rel={rel}
							aria-label={label}
							title={label}
							className="d-inline-flex align-items-center gap-2 text-decoration-none text-primary border p-2 rounded-pill"
						>
							<Image src={iconUrl} alt={item?.iconAlt || label} width={18} height={18} />
							<span className="font-montserrat small text-uppercase sr-only">{label}</span>
						</a>
					);
				})}
			</div>
		</div>
	);
}
