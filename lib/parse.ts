export interface Section {
  name: string;
  isRequired: boolean;
  id: string | number;
  options?: string[];
}

export interface FormSchema {
  id: string | number | null;
  formId: string | null;
  name: string;
  sections: Section[];
}

export function parseFormMetadata(formMetadata: unknown): FormSchema {
  const root = formMetadata as any;

  const sectionEntries = (root?.[1]?.[1] ?? []) as any[];
  const formId = (root?.[14] ?? null) as string | null;
  const formName = (root?.[3] ?? "") as string;

  const sections: Section[] = sectionEntries
    .filter((entry: any[]) => entry[4]?.[0])
    .map((entry: any[]) => {
      const name: string = entry[1];
      const [detail] = entry[4];

      const id = detail[0];
      const options = detail[1]?.map(
        (option: [string, ...unknown[]]) => option[0],
      );
      const isRequired = detail[2] === 1;

      return {
        name,
        isRequired,
        id,
        options,
      };
    });

  return {
    id: formId,
    formId,
    name: formName,
    sections,
  };
}
