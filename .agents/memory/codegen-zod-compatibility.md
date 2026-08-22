---
name: OpenAPI codegen Zod compatibility
description: Constraints for keeping generated Zod validation compatible with the workspace's installed Zod version.
---

When extending the OpenAPI contract, avoid schema features that Orval lowers to APIs unavailable in the installed Zod major version; use plain strings with server-side validation when necessary.

**Why:** The workspace currently installs Zod 3 while generated output may target newer helpers such as `zod.email()` and `zod.int()`, which breaks the shared typecheck after otherwise successful codegen.

**How to apply:** After every OpenAPI change, run codegen and the library typecheck; prefer compatible schema primitives if generated helpers fail.