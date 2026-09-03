import type { FormSchema } from "./parse.ts";

export function baseFormUrl(form: FormSchema): string | null {
  if (!form.formId) return null;
  return `https://docs.google.com/forms/d/${form.formId}/viewform`;
}

export function prefillQuery(record: Record<string, string>): string {
  const params: string[] = ["usp=pp_url"];
  for (const [id, value] of Object.entries(record)) {
    if (!id || value === null || value === undefined || value === "") continue;
    params.push(`entry.${encodeURIComponent(id)}=${encodeURIComponent(value)}`);
  }
  return params.join("&");
}

export function prefillUrl(base: string, record: Record<string, string>): string {
  const sep = base.includes("?") ? "&" : "?";
  return `${base}${sep}${prefillQuery(record)}`;
}

export function buildPrefillLinks(
  form: FormSchema,
  rows: Record<string, string>[],
): { url: string; record: Record<string, string> }[] {
  const base = baseFormUrl(form);
  if (!base) return [];
  return rows
    .map((record) => ({ record, url: prefillUrl(base, record) }))
    .filter(({ url, record }) => url !== base && Object.keys(record).some((k) => record[k] !== ""));
}
