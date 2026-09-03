# google-form-filler

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.4.0. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.


so from this form url 
https://docs.google.com/forms/d/e/1FAIpQLSflgyMh9R5uPnd2U-tChJi4gSBfjOtMrUFE9smbNEjjMt34XQ/viewform


we get this info we will call this form meta data

index ts already parsed the metadata

and to generate prefilled form will return someting like this

https://docs.google.com/forms/d/e/1FAIpQLSflgyMh9R5uPnd2U-tChJi4gSBfjOtMrUFE9smbNEjjMt34XQ/viewform?usp=pp_url&entry.558888358=2026-09-03&entry.1274742331=PROJECT+A&entry.742280340=8&entry.825021947=TASKJ+1&entry.502560662=4&entry.494263976=4


but i wanted web interface