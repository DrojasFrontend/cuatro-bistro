"use client";

import { useState } from "react";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";

const INITIAL_FORM = {
	nombre: "",
	apellido: "",
	fechaEvento: "",
	capacidad: "",
	tipoEvento: "social",
	correo: "",
	telefono: "+57",
};

export default function EventQuoteForm() {
	const [form, setForm] = useState(INITIAL_FORM);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [feedback, setFeedback] = useState({ type: "", message: "" });

	function onChange(event) {
		const { name, value } = event.target;
		setForm((current) => ({ ...current, [name]: value }));
	}

	async function onSubmit(event) {
		event.preventDefault();
		setFeedback({ type: "", message: "" });
		setIsSubmitting(true);

		try {
			const response = await fetch("/api/evento-cotizacion", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					nombre: form.nombre,
					apellido: form.apellido,
					fechaEvento: form.fechaEvento,
					capacidad: form.capacidad,
					tipoEvento: form.tipoEvento,
					correo: form.correo,
					telefono: form.telefono,
				}),
			});

			const payload = await response.json();

			if (!response.ok || !payload?.ok) {
				throw new Error(payload?.message || "No fue posible enviar la cotización en este momento.");
			}

			setForm(INITIAL_FORM);
			setFeedback({
				type: "success",
				message: "Tu solicitud fue enviada con éxito. Te contactaremos pronto.",
			});
		} catch (error) {
			setFeedback({
				type: "error",
				message:
					error instanceof Error && error.message
						? "No pudimos enviar tu solicitud ahora. Intenta nuevamente en unos minutos."
						: "No pudimos enviar tu solicitud ahora. Intenta nuevamente en unos minutos.",
			});
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<form onSubmit={onSubmit} className="row g-3">
			<div className="col-12 col-md-6">
				<label htmlFor="nombre" className="form-label font-montserrat text-primary small text-uppercase">
					Nombre
				</label>
				<input
					id="nombre"
					name="nombre"
					type="text"
					className="form-control bg-transparent text-primary border rounded-3"
					value={form.nombre}
					onChange={onChange}
					required
				/>
			</div>
			<div className="col-12 col-md-6">
				<label htmlFor="apellido" className="form-label font-montserrat text-primary small text-uppercase">
					Apellido
				</label>
				<input
					id="apellido"
					name="apellido"
					type="text"
					className="form-control bg-transparent text-primary border rounded-3"
					value={form.apellido}
					onChange={onChange}
					required
				/>
			</div>
			<div className="col-12 col-md-6">
				<label htmlFor="fechaEvento" className="form-label font-montserrat text-primary small text-uppercase">
					Fecha de evento
				</label>
				<input
					id="fechaEvento"
					name="fechaEvento"
					type="date"
					className="form-control bg-transparent text-primary border rounded-3"
					value={form.fechaEvento}
					onChange={onChange}
					required
				/>
			</div>
			<div className="col-12 col-md-6">
				<label htmlFor="capacidad" className="form-label font-montserrat text-primary small text-uppercase">
					Capacidad
				</label>
				<input
					id="capacidad"
					name="capacidad"
					type="number"
					min="1"
					className="form-control bg-transparent text-primary border rounded-3"
					value={form.capacidad}
					onChange={onChange}
					required
				/>
			</div>
			<div className="col-12 col-md-6">
				<label htmlFor="tipoEvento" className="form-label font-montserrat text-primary small text-uppercase">
					Tipo de evento
				</label>
				<select
					id="tipoEvento"
					name="tipoEvento"
					className="form-select bg-transparent text-primary border rounded-3"
					value={form.tipoEvento}
					onChange={onChange}
					required
				>
					<option value="social">Social</option>
					<option value="corporativo">Corporativo</option>
				</select>
			</div>
			<div className="col-12 col-md-6">
				<label htmlFor="correo" className="form-label font-montserrat text-primary small text-uppercase">
					Correo electrónico
				</label>
				<input
					id="correo"
					name="correo"
					type="email"
					className="form-control bg-transparent text-primary border rounded-3"
					value={form.correo}
					onChange={onChange}
					required
				/>
			</div>
			<div className="col-12">
				<label htmlFor="telefono" className="form-label font-montserrat text-primary small text-uppercase">
					Número telefónico
				</label>
				<PhoneInput
					defaultCountry="co"
					value={form.telefono}
					onChange={(phone) => setForm((current) => ({ ...current, telefono: phone }))}
					className="w-100"
					inputClassName="form-control bg-transparent text-primary border rounded-end-3"
					countrySelectorStyleProps={{
						buttonClassName: "border rounded-start-3 bg-transparent text-primary",
					}}
					inputProps={{
						id: "telefono",
						name: "telefono",
						required: true,
						placeholder: "300 123 4567",
					}}
				/>
			</div>

			{feedback.message ? (
				<div className="col-12">
					<p
						role="alert"
						className={`alert mb-0 small font-montserrat ${
							feedback.type === "success" ? "alert-success" : "alert-danger"
						}`}
					>
						{feedback.message}
					</p>
				</div>
			) : null}

			<div className="col-12">
				<button
					type="submit"
					className="w-100 btn border rounded-3 text-uppercase text-primary font-montserrat"
					disabled={isSubmitting}
				>
					{isSubmitting ? "Enviando..." : "Enviar solicitud"}
				</button>
			</div>
		</form>
	);
}
