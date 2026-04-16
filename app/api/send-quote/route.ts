import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const { name, email, phone, company, service, message } = body;

        if (!name || !email || !phone || !service || !message) {
            return NextResponse.json(
                { ok: false, message: "Faltan campos obligatorios." },
                { status: 400 }
            );
        }

        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: Number(process.env.SMTP_PORT) === 465,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        await transporter.sendMail({
            from: `"Formulario Web" <${process.env.SMTP_USER}>`,
            to: process.env.MAIL_TO,
            replyTo: email,
            subject: `Nueva cotización - ${name} - ${service}`,
            text: `
Nombre: ${name}
Correo: ${email}
Teléfono: ${phone}
Empresa: ${company || "No indicada"}
Servicio: ${service}

Mensaje:
${message}
      `,
            html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>Nueva solicitud de cotización</h2>
          <p><strong>Nombre:</strong> ${name}</p>
          <p><strong>Correo:</strong> ${email}</p>
          <p><strong>Teléfono:</strong> ${phone}</p>
          <p><strong>Empresa:</strong> ${company || "No indicada"}</p>
          <p><strong>Servicio:</strong> ${service}</p>
          <p><strong>Mensaje:</strong><br/>${message.replace(/\n/g, "<br/>")}</p>
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