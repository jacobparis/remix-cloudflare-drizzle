# Welcome to Remix + Vite!

📖 See the [Remix docs](https://remix.run/docs) and the [Remix Vite docs](https://remix.run/docs/en/main/future/vite) for details on supported features.

## D1

Create a new database named "db""

```sh
npx wrangler d1 create db
```

Paste the command output in `wrangler.toml`:

```toml
[[d1_databases]]
binding = "DB" # i.e. available in your Worker on env.DB
database_name = "db"
database_id = "ccccccvktlfkrjvvrngbckuvtrrkugtu"
# Also add this field
migrations_dir="./app/drizzle/migrations"
```

Add the drizzle migration

Generate types for your Cloudflare bindings in `wrangler.toml`. You will need to do this whenever you make changes to `wrangler.toml`.

```sh
npm run typegen
```

## Running migrations

After making changes to the Drizzle schema, run the following command to generate a new migration file and apply it to your local database:

```ts
npm run db:migrate:local
```

## Development

Run the Vite dev server:

```sh
npm run dev
```

To run Wrangler:

```sh
npm run build
npm run start
```

## Deployment

> [!WARNING]  
> Cloudflare does _not_ use `wrangler.toml` to configure deployment bindings.
> You **MUST** [configure deployment bindings manually in the Cloudflare dashboard][bindings].

First, build your app for production:

```sh
npm run build
```

Then, deploy your app to Cloudflare Pages:

```sh
npm run deploy
```

[bindings]: https://developers.cloudflare.com/pages/functions/bindings/
