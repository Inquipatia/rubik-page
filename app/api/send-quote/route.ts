import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

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
    const body = await req.json();

    const name = body.name?.trim();
    const email = body.email?.trim();
    const phone = body.phone?.trim();
    const company = body.company?.trim() || "No indicada";
    const service = body.service?.trim();
    const message = body.message?.trim();

    if (!name || !email || !phone || !service || !message) {
      return NextResponse.json(
        { ok: false, message: "Faltan campos obligatorios." },
        { status: 400 }
      );
    }

    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_TO } = process.env;

    if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !MAIL_TO) {
      return NextResponse.json(
        { ok: false, message: "Faltan variables de entorno del servidor." },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: Number(SMTP_PORT) === 465,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });

    await transporter.verify();

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

    return NextResponse.json({
      ok: true,
      message: "Correo enviado correctamente.",
    });
  } catch (error) {
    console.error("Error enviando correo:", error);

    return NextResponse.json(
      { ok: false, message: "No se pudo enviar el correo." },
      { status: 500 }
    );
  }
}