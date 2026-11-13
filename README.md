This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

Typography uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) with Playfair Display for headings and Lora for body copy.

## Project structure

```
app/                      Next.js App Router pages and layouts
  blog/[id]/              Article detail page
  add-edit-blog/          Create / edit form page
components/
  blog/                   Blog feature components (card, form)
  layout/                 App chrome (header, footer)
  ui/                     Reusable UI (toast, pagination, theme toggle)
lib/                      Shared client and constants
public/                   Static assets
```

Each component keeps its CSS module next to it. Theme colors, borders, and typography live as CSS variables in `app/globals.css`.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
