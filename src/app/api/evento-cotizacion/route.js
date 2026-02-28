import { NextResponse } from "next/server";

const ALLOWED_EVENT_TYPES = new Set(["social", "corporativo"]);

function clean(value) {
	return typeof value === "string" ? value.trim() : "";
}

function isValidEmail(value) {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request) {
	const webhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL;
	const webhookToken = process.env.FORM_WEBHOOK_TOKEN;

	if (!webhookUrl || !webhookToken) {
		return NextResponse.json(
			{ ok: false, message: "Faltan variables de entorno del webhook." },
			{ status: 500 },
		);
	}

	let body;
	try {
		body = await request.json();
	} catch {
		return NextResponse.json({ ok: false, message: "Body inválido." }, { status: 400 });
	}

	const nombre = clean(body?.nombre);
	const apellido = clean(body?.apellido);
	const fechaEvento = clean(body?.fechaEvento);
	const capacidad = clean(body?.capacidad);
	const tipoEvento = clean(body?.tipoEvento).toLowerCase();
	const correo = clean(body?.correo).toLowerCase();
	const telefono = clean(body?.telefono);

	if (!nombre || !apellido || !fechaEvento || !capacidad || !tipoEvento || !correo || !telefono) {
		return NextResponse.json({ ok: false, message: "Todos los campos son obligatorios." }, { status: 400 });
	}

	if (!isValidEmail(correo)) {
		return NextResponse.json({ ok: false, message: "Correo electrónico inválido." }, { status: 400 });
	}

	if (!ALLOWED_EVENT_TYPES.has(tipoEvento)) {
		return NextResponse.json({ ok: false, message: "Tipo de evento inválido." }, { status: 400 });
	}

	let response;
	try {
		response = await fetch(webhookUrl, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				token: webhookToken,
				nombre,
				apellido,
				fecha_evento: fechaEvento,
				capacidad,
				tipo_evento: tipoEvento,
				correo,
				telefono,
			}),
			cache: "no-store",
		});
	} catch {
		return NextResponse.json(
			{ ok: false, message: "No fue posible conectar con Google Sheets." },
			{ status: 502 },
		);
	}

	const responseText = await response.text();
	let parsedResponse = null;
	try {
		parsedResponse = responseText ? JSON.parse(responseText) : null;
	} catch {
		parsedResponse = null;
	}

	const webhookAccepted = response.ok && parsedResponse?.ok === true;
	if (!webhookAccepted) {
		console.error("Google Sheets webhook error", {
			status: response.status,
			responseText,
		});
		return NextResponse.json(
			{ ok: false, message: "No se pudo registrar la solicitud en Google Sheets." },
			{ status: 502 },
		);
	}

	return NextResponse.json({ ok: true });
}
