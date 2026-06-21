# Miles Waugh — Homepage

## Deployment

First, edit site-links.json. Then, run
```bash
npm run generate
```
to read `site-links.json` and regenerate `sitemap.xml` (main-site URLs only) and the link list inside `404.html` (entries marked show_in_404) to match. Finally, push changes to the repo.
