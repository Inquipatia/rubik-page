export type QuoteField = "name" | "phone" | "email" | "company" | "message" | "service";
export type Quote = Record<QuoteField, string>;
export type QuoteErrors = Partial<Record<QuoteField, string>>;

export function validateQuote(input: unknown) {
  const source = input && typeof input === "object" ? input as Record<string, unknown> : {};
  const fields: QuoteField[] = ["name", "phone", "email", "company", "message", "service"];
  const quote = Object.fromEntries(fields.map(key => [key, typeof source[key] === "string" ? source[key].trim() : ""])) as Quote;
  const errors: QuoteErrors = {};
  if (!quote.name) errors.name = "Ingresa tu nombre.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(quote.email)) errors.email = "Ingresa un correo válido.";
  const digits = quote.phone.replace(/\D/g, "");
  if (!/^\+?[\d\s()-]+$/.test(quote.phone) || digits.length < 9 || digits.length > 15) errors.phone = "Ingresa un teléfono válido, por ejemplo +56 9 1234 5678.";
  if (!quote.message) errors.message = "Ingresa el detalle de tu cotización.";
  if (!["Neón", "Stands", "Impresión", "Volumétricas", "Otros"].includes(quote.service)) errors.service = "Selecciona un servicio.";
  const limits: Record<QuoteField, number> = {name: 200, phone: 40, email: 254, company: 200, message: 10000, service: 40};
  for (const field of fields) if (quote[field].length > limits[field]) errors[field] = `Máximo ${limits[field]} caracteres.`;
  return { quote, errors, valid: Object.keys(errors).length === 0 };
}
