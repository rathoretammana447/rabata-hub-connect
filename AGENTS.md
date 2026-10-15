<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Use shared Header, Footer and PageHeading from site-shell for public pages, keeping navigation consistent.
- All public enquiry forms use the shared Zod schema and server-only intake RPC; submissions have no browser grants or read policies, protecting children's information.
- Maintain learning resources in src/lib/resources.ts and page metadata in each leaf route; external resources must identify their publisher.
- Enquiry alerts use the connected Gmail account server-side and send only to the site-configured owner email; never accept a notification recipient from the browser, and preserve saved enquiries if sending fails.
