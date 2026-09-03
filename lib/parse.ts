
export interface Section {
  name: string;
  isRequired: boolean;
  id: string | number;
  options?: string[];
  type: QuestionType;
}

export interface FormSchema {
  id: string | number | null;
  formId: string | null;
  name: string;
  sections: Section[];
}

const typeMap = {
  0: "short_answer",
  1: "paragraph",
  2: "multiple_choice",
  3: "dropdown",
  4: "checkboxes",
  5: "linear_scale",
  7: "grid_choice",
  9: "date",
  10: "time",
  13: "file_upload",
  18: "rating",
} as const;

export type QuestionType = (typeof typeMap)[keyof typeof typeMap] | "unknown";

function getTypeString(type: number): QuestionType {
  return typeMap[type as keyof typeof typeMap] ?? "unknown";
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
        desc: entry[2],
        isRequired,
        id,
        options,
        type: getTypeString(entry[3]),
      };
    });
    

  return {
    id: formId,
    formId,
    name: formName,
    sections,
  };
}
