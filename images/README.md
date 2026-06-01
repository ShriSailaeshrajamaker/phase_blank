# RIXSTO Affiliate Sites — Eleventy + Decap CMS

This project turns your CMS product data into **real, separate blog pages**
(e.g. `phaseblank.rixsto.in/phaseblank/blogs/steel-lunch-box/`) with proper URLs
and good SEO — generated automatically every time someone publishes in the CMS.

## How it works (the flow)

1. Your team adds a product in the CMS (Decap). It saves to `products/<site>.json`.
2. That commit triggers Netlify, which runs `npm run build` (Eleventy).
3. Eleventy reads every `products/*.json`, and for **each product** it generates a
   real page at `/<site>/blogs/<slug>/index.html` — the blog/review page, with the
   Buy button inside.
4. The storefront grid links each product card to its generated blog page.

So: **add product in CMS → blog page is auto-created. No manual HTML.**

## Folder map

```
.
├── .eleventy.js              Eleventy config (input/output, passthrough)
├── netlify.toml              Tells Netlify to run the build
├── package.json              Build scripts + Eleventy dependency
├── _data/blogs.js            Loads ALL sites' JSON → flat list of blog entries
├── blog.njk                  ONE template → generates every product's blog page
├── home.njk                  Simple root landing page
├── phaseblank-store.njk      Phase Blank storefront (grid → links to blog pages)
├── products/                 The CMS data (one JSON per site)
│   ├── phaseblank.json
│   ├── index.json            (Online Finds)
│   ├── dailyloot.json
│   ├── justoneclick.json
│   └── cartedupdaily.json
├── admin/                    The Decap CMS (config.yml + index.html)
└── images/                   Uploaded images land here
```

## Run it locally (to preview before deploying)

```
npm install
npm start
```
Then open the printed localhost URL. Add `/phaseblank/` to see the storefront,
and click any product to see its generated blog page.

To just build (what Netlify does):
```
npm run build
```
Output goes to `_site/`.

## Deploy on Netlify (free)

1. Push this whole folder to your GitHub repo.
2. In Netlify: New site → import the repo.
3. Build command: `npm run build`  ·  Publish directory: `_site`
   (these are already in `netlify.toml`, so it auto-detects).
4. Enable Identity + Git Gateway for the CMS (as before).

Every CMS publish now rebuilds the blog pages automatically.

## Adding the OTHER 4 sites

Phase Blank is fully wired as the working template. For each of the other sites
(onlinefinds, dailyloot, justoneclick, cartedupdaily):

1. Their products already load via `_data/blogs.js` — so their **blog pages are
   already generated** the moment their `products/<site>.json` has products.
2. You just need a **storefront page** for each, like `phaseblank-store.njk`.
   Copy that file, rename (e.g. `dailyloot-store.njk`), and change:
   - the `permalink` to `/dailyloot/index.html`
   - `const SITE = "dailyloot";`
   - the fetch URL to `/products/dailyloot.json`
   - the branding/colours/links to match that site.

That's it — the blog-page generation is shared and automatic across all sites.
```
