// http://localhost:5173/

import { json, type MetaFunction } from "@remix-run/cloudflare"
import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node"
import { Form, useLoaderData } from "@remix-run/react"
import { drizzle } from "drizzle-orm/d1"
import { resources } from "~/drizzle/schema.server"

export const meta: MetaFunction = () => {
  return [
    { title: "Remix Drizzle Cloudflare D1 Vite" },
    {
      name: "description",
      content: "Welcome to Remix! Using Drizzle, Vite and Cloudflare D1!",
    },
  ]
}

export async function action({ request, context }: ActionFunctionArgs) {
  const formData = await request.formData()

  const title = formData.get("title") as string
  const href = formData.get("href") as string

  const db = drizzle(context.cloudflare.env.DB)
  await db.insert(resources).values({ title, href }).execute()

  return json({ message: "Resource added" }, { status: 201 })
}

export async function loader({ context }: LoaderFunctionArgs) {
  const db = drizzle(context.cloudflare.env.DB)

  const resourceList = await db
    .select({
      id: resources.id,
      title: resources.title,
      href: resources.href,
    })
    .from(resources)
    .orderBy(resources.id)

  return json({
    resourceList,
  })
}

export default function Index() {
  const { resourceList } = useLoaderData<typeof loader>()

  const hasCloudflareDocs = resourceList.some(
    (resource) =>
      resource.href ===
      "https://developers.cloudflare.com/pages/framework-guides/deploy-a-remix-site/"
  )

  const hasRemixDocs = resourceList.some(
    (resource) =>
      resource.href === "https://remix.run/docs/en/main/future/vite#cloudflare"
  )

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>Welcome to Remix (with Drizzle, Vite and Cloudflare D1)</h1>

      <ul>
        {resourceList.map((resource) => (
          <li key={resource.id}>
            <a target="_blank" href={resource.href} rel="noreferrer">
              {resource.title}
            </a>
          </li>
        ))}
      </ul>

      <Form method="POST">
        <div>
          <label>
            Title: <input type="text" name="title" required />
          </label>
        </div>
        <div>
          <label>
            URL: <input type="url" name="href" required />
          </label>
        </div>
        <button type="submit">Add Resource</button>
      </Form>

      {hasCloudflareDocs ? null : (
        <Form method="POST">
          <input
            type="hidden"
            name="title"
            value="Cloudflare Pages Docs - Remix guide"
          />
          <input
            type="hidden"
            name="href"
            value="https://developers.cloudflare.com/pages/framework-guides/deploy-a-remix-site/"
          />
          <button type="submit">Add Cloudflare Docs</button>
        </Form>
      )}

      {hasRemixDocs ? null : (
        <Form method="POST">
          <input type="hidden" name="title" value="Remix Cloudflare Docs" />
          <input
            type="hidden"
            name="href"
            value="https://remix.run/docs/en/main/future/vite#cloudflare"
          />
          <button type="submit">Add Vite Docs</button>
        </Form>
      )}
    </div>
  )
}
