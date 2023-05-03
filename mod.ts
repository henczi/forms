const index = (items: { name: string, path: string }[]) => `
<html>
    <body>
        <h1>Forms</h1>
        <ul>
            ${items.map(x => `<li><a href="${x.path}">${x.name}</a></li>`).join('\n')}
        </ul>
    </body>
</html>
`;

const e404 = () => `
<html>
    <body>
        <h1 style="text-align: center" >Opps - 404</h1>
    </body>
</html>
`;

const forms = [
    { name: 'Meghatalmazás', path: '/meghatalmazas.html' }
];


async function handleRequest(request: Request) {
    const { pathname } = new URL(request.url);

    if (pathname === '/') {
        return new Response(
            index(forms),
            {
                headers: {
                    "content-type": "text/html; charset=utf-8",
                },
            },
        );
    }

    for (const form of forms) {
        if (pathname === form.path) {
            const formUrl = new URL(form.path.substring(1), import.meta.url);
            const response = await fetch(formUrl);
            const headers = new Headers(response.headers);
            headers.set("content-type", "text/html; charset=utf-8");
            headers.set('content-security-policy', ' default-src \'none\'; style-src \'unsafe-inline\'; script-src \'unsafe-inline\'');
            return new Response(response.body, { ...response, headers });
        }
    }


    return new Response(
        e404(),
        {
            headers: {
                "content-type": "text/html; charset=utf-8",
            },
        },
    );
}

addEventListener("fetch", (event: FetchEvent) => {
    event.respondWith(handleRequest(event.request));
});