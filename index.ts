import { parseArgs } from "util";
import { parseFormMetadata } from "./lib/parse.ts";

const { values } = parseArgs({
  args: Bun.argv,
  options: {
    metadata: {
      type: "string",
    },
  },
  strict: true,
  allowPositionals: true,
});

if (!values.metadata) {
  console.error("Error: --metadata argument is required.");
  process.exit(1);
}

const formMetadata = await Bun.file(values.metadata).json();
const form = parseFormMetadata(formMetadata);

console.log(JSON.stringify(form, null, 2));
