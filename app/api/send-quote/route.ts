import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { getSupabase } from "../../lib/supabase";
import { validateQuote } from "../../lib/quote-validation";

export const runtime = "nodejs";

function escapeHtml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function POST(req: Request) {
  try {
    let body: unknown;
    try { body = await req.json(); } catch {
      return NextResponse.json({ ok: false, message: "Solicitud inválida." }, { status: 400 });
    }
    const { quote, errors, valid } = validateQuote(body);
    if (!valid) return NextResponse.json({ ok: false, message: Object.values(errors).join(" "), errors }, { status: 400 });
    const { name, email, phone, service, message } = quote;
    const company = quote.company || "No indicada";
    const { error } = await getSupabase().from("cotizaciones").insert({
      nombre: name, telefono: phone, correo: email,
      empresa: quote.company || null, detalle: message, servicio: service,
    }).abortSignal(AbortSignal.timeout(15000));
    if (error) {
      console.error("quote_insert_failed", { code: error.code });
      return NextResponse.json({ ok: false, message: "No pudimos guardar tu solicitud. Conservamos tus datos para que puedas reintentar." }, { status: 503 });
    }

    // A mail failure must not turn a persisted quote into a failed submission.
    try {
      const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_TO } = process.env;

      if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !MAIL_TO) {
        throw new Error("SMTP configuration missing");
      }

      const transporter = nodemailer.createTransport({
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 15000,
        host: SMTP_HOST,
        port: Number(SMTP_PORT),
        secure: Number(SMTP_PORT) === 465,
        auth: {
          user: SMTP_USER,
          pass: SMTP_PASS,
        },
      });

      await transporter.sendMail({
        from: `"Formulario Web Rubik" <${SMTP_USER}>`,
        to: MAIL_TO,
        replyTo: email,
        subject: `Nueva cotización - ${name} - ${service}`,
        text: `
  Nombre: ${name}
  Correo: ${email}
  Teléfono: ${phone}
  Empresa: ${company}
  Servicio: ${service}

  Mensaje:
  ${message}
        `.trim(),
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;">
            <h2>Nueva solicitud de cotización</h2>
            <p><strong>Nombre:</strong> ${escapeHtml(name)}</p>
            <p><strong>Correo:</strong> ${escapeHtml(email)}</p>
            <p><strong>Teléfono:</strong> ${escapeHtml(phone)}</p>
            <p><strong>Empresa:</strong> ${escapeHtml(company)}</p>
            <p><strong>Servicio:</strong> ${escapeHtml(service)}</p>
            <p><strong>Mensaje:</strong><br/>${escapeHtml(message).replace(/\n/g, "<br/>")}</p>
          </div>
        `,
      });

    } catch {
      console.error("quote_saved_email_failed: revisar configuración y registros SMTP; la cotización permanece en Supabase");
      return NextResponse.json({ ok: true, saved: true, notificationSent: false });
    }
    return NextResponse.json({ ok: true, saved: true, notificationSent: true });
  } catch (error) {
    console.error("quote_request_failed", {
      type: error instanceof Error ? error.name : "unknown",
      configurationMissing: error instanceof Error && error.message === "Supabase configuration missing",
    });

    return NextResponse.json(
      { ok: false, message: "No pudimos confirmar el guardado de tu solicitud. Tus datos permanecen en el formulario." },
      { status: 500 }
    );
  }
}
