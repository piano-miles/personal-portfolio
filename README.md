# Miles Waugh — Homepage

## Page Changes

Whenever a page is added/removed/changed, edit `site-links.json` to reflect the change. Then, run

```bash
npm run generate
```

to read `site-links.json` and regenerate `sitemap.xml` (main-site URLs only) and the link list inside `404.html` (entries marked `show_in_404`) to match. Finally, commit and push the changes to deploy.
