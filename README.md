# BIM Open Schema Reader

Ultra-fast, fully local BIM data analysis in your browser.  
Powered by DuckDB-Wasm and Next.js.

- Ultra-fast queries: Run lightning-fast SQL on BIM Open Schema data exported from Revit.
- 100% private: No servers, no uploads—everything runs locally in your browser.
- Flexible analysis: Write custom SQL queries and explore results with interactive tables, charts, and visualizations.

## App

Hosted version can be found here: https://rschema-reader.aectooling.com/

## What it is

- A minimal, no-frills way to work with BIM Open Schema data using plain SQL.
- Runs entirely in your browser, powered by DuckDB-Wasm for ultra-fast queries.
- A starter toolkit to explore, filter, and analyze model data with simple, composable UI pieces.

## What it is not

- Not a dashboard builder or drag‑and‑drop BI tool.
- BYO visualization/reporting: use this app to shape data with SQL, export the results, and visualize or report elsewhere.
- A query sandbox: iterate on queries to discover exactly what you need—then reuse those queries in your own app.

## BIM Open Schema

This project is built on top of the BIM Open Schema created and maintained by Ara3D.  
Learn more and access the schema here: https://github.com/ara3d/bim-open-schema

## Contributing

This is open source under MIT. I haven’t set formal contribution guidelines yet—if you’re interested in contributing (features, fixes, docs, examples), please get in touch via Issues or Discussions. PRs welcome once we’ve aligned on scope.

- Open an issue to discuss ideas
- Keep PRs focused and include a brief description and screenshots if UI-related

## TODO

- [ ] add a way to jump to query from the sidebar (maybe show only one or various
      queries options...? scrolling issue is still very annoying)
- [x] make edited query more obvious after edited...
- [ ] click on category to generate a query...? (or add it to addible list...?)
- [ ] Categorize categories (e.g. model, m&E , arch, struct, draft, material, unsorted, etc...), can be similar to how Revit ribbon is categorized
