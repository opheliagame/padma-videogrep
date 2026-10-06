# Specification Conventions

- Keep project documentation under the top-level `spec/` directory.
- Preserve project boundaries under `spec/`, then group documents by purpose, such as `screens/`, `repository/`, `services/`, and `design/`.
- Assign sequential IDs in the form `spec_001` only to individually cataloged behavior specifications, such as screens, repositories/stores, and services/actions. Keep those IDs stable when files move, and use the next unused number for new eligible specs.
- Do not assign spec IDs to architecture, design, or general reference documents, or to the reusable specification template.
- Maintain the central `spec/README.md` index when adding, moving, or renaming specification documents.