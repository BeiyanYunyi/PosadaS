# Posada-S

A viewer for data scraped by NSDBG-Next, optimized for social sharing and search engine. Posting and commenting are not supported yet.

## Related Projects

- [NSDBG-Next](https://github.com/BeiyanYunyi/NSDBG-Next) - Scraper for Douban Group, maybe unusable for now, since it've been 2 years since last update.
- [n2rv](https://github.com/BeiyanYunyi/n2rv) - A viewer for data scraped by NSDBG-Next. Posting and commenting are supported.

## About Posadas Group

Posadas Group was a Douban Group existed from 2020.7 to 2021.12.

## Container lifecycle

The image installs **all** locked dependencies and generates Panda styles, but does
not run `next build`, connect to the application database, or copy `.env` files.
It includes Maple Mono NF CN Regular v7.9 from the official upstream release,
verified with SHA256; its SIL OFL license is shipped at
`/app/licenses/maple-mono/LICENSE.txt`. No package/font downloads happen at startup.
The optional `POSADAS_FONT_PATH` overrides the original bundled font path.

Run the same image in two phases:

1. `init` (alias `build`): validate configuration and run `next build`, preserving
   the application's existing database-backed prerendering. The process exits
   nonzero on error and marks success only after a completed build with BUILD_ID.
2. `start` (default): require completed artifacts for this image's source/dependency
   fingerprint and exec `next start`. It **never** builds or installs dependencies.

For Kubernetes, mount the same **Pod-scoped emptyDir at `/app/.next`** in both the
initContainer and application container. Set args to `["init"]` and `["start"]`
respectively, using the same immutable image digest. Use `runAsUser: 1000`,
`runAsGroup: 1000`, `runAsNonRoot: true`, and Pod `fsGroup: 1000` so the fresh
volume is writable without a root initContainer. Do not share this volume between
Pods or run concurrent builders. Main-container restarts reuse the completed
build; replacing the Pod gets a fresh build. Failed init attempts clear partial
output and retry. A successful init retry skips rebuilding. `/app` must remain
writable during init (Next also writes type metadata outside `.next`); do not
turn on `readOnlyRootFilesystem` without accommodating those writes. Runtime
cache writes remain inside the shared volume.

Pass application configuration to **both** containers:

- `DATABASE_URL`: reachable, existing, populated PostgreSQL database. Runtime
  routes also query it; it is not an init-only secret. No migrations are run.
- `SERVE_URL`: absolute public HTTP(S) origin, used for metadata and prerendered URLs.
- `SCHEMA_NAME`, or the `schema` query parameter in `DATABASE_URL`: the existing
  non-public database schema. The application's current `pgSchema` definitions
  do not support `public`; init reports this clearly rather than hiding it.
- Existing application-specific settings such as `IMAGE_SERVE_URL` and Band
  credentials, as required by the configured features.

Inject secrets at deployment, never as Docker build arguments. Prerendered pages
contain application data, so treat the build volume as application data too.
Use adequate init CPU/memory and deployment progress timeout for the full data
set. The runtime's former resource limit may not be sufficient for a Next build.
Changing prerender configuration/data requires a new Pod, not merely restarting
its main container. Non-public runtime pages retain their existing behavior;
this change does not convert pages to dynamic rendering.

For local Compose, provide `.env` values as in `.env.example`, pointing DATABASE_URL
at a provisioned database (use hostname `postgres` for the Compose database).
`docker compose up --build` runs a one-shot init service before the app and shares
a named volume. This does **not** provision the application database/schema. If
configuration changes but source does not, remove **only** the `next-build` volume
or recreate it before initializing again; do not delete the database volume.
Kubernetes emptyDir avoids this stale-configuration concern across Pod replacements.

## Container CI and publication

The Container workflow runs lifecycle unit tests, builds without application
secrets, then uses a disposable PostgreSQL fixture to test real init, artifact
reuse, HTTP startup, sitemap access and graceful shutdown. PRs never log into
GHCR or publish packages. After a reviewed merge to `main`, the publish job runs
only after tests pass, using the workflow's `GITHUB_TOKEN` with `packages: write`.
It publishes `ghcr.io/beiyanyunyi/posadas:main` and `sha-<full commit SHA>` for
`linux/amd64`, by transferring the exact tested image between jobs (no rebuild), then verifies the published manifest
and writes its immutable digest to the workflow summary.

The workflow does not make the package public, create registry credentials,
change deployment manifests or deploy. A private package requires an existing
authorized image-pull credential in the cluster. The infrastructure PR should
only follow a successful first publication and reference the verified image
and digest (Renovate can track the mutable `main` tag with digest pinning).

Run the dependency-free initialization tests with
`node --test test/*.test.mjs`. With Docker available, build `posadas:test` and run
`bash test/container-smoke.sh`. The smoke test uses a minimal synthetic schema fixture;
it does not replace validation against a representative application dataset.
