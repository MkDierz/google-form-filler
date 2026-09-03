import { parseArgs } from "util";

const { values, positionals } = parseArgs({
  args: Bun.argv,
  options: {
    metadata: {
      type: "string",
    },
  },
  strict: true,
  allowPositionals: true,
});

// validate that the metadata argument is provided
if (!values.metadata) {
  console.error("Error: --metadata argument is required.");
  process.exit(1);
}
// if became web app then this will be different
const formMetadata = await Bun.file(values.metadata).json();

const sectionEntries = formMetadata?.[1]?.[1] ?? [];

interface FormSchema {
  id: string;
  name: string;
  sections: Section[];
}

interface Section {
  name: string;
  isRequired: boolean;
  id: string | number;
  options?: string[];
}

const formId = formMetadata?.[14] ?? null;
const formName = formMetadata?.[3] ?? "";
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

const form: FormSchema = {
  id: formId,
  name: formName,
  sections,
};

// console.log(form);
