# Attivare "Ovunque" nel Worker Cloudflare

Il frontend ROAM chiama `POST /explore` sul Worker già esistente. Per non sovrascrivere la ricerca voli `/search`, aggiungi il blocco seguente **dentro il metodo `fetch(request, env)`**, subito dopo la creazione di `url` (`const url = new URL(request.url)`) e prima della risposta "Endpoint non valido".

Il Worker deve già avere il secret Cloudflare `SERPAPI_KEY`. Non inserirlo nel codice.

```js
if (url.pathname === "/explore") {
  const cors = {
    "Access-Control-Allow-Origin": "https://valerioz1992.github.io",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json; charset=utf-8"
  };
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: cors });
  }
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Metodo non consentito" }), {
      status: 405, headers: cors
    });
  }
  try {
    const body = await request.json();
    const departure = String(body.departure_id || "").trim().toUpperCase();
    const codes = departure.split(",");
    if (!codes.length || codes.some(code => !/^[A-Z]{3}$/.test(code))) {
      return new Response(JSON.stringify({ error: "Città di partenza non valida" }), {
        status: 400, headers: cors
      });
    }
    const params = new URLSearchParams({
      engine: "google_travel_explore",
      departure_id: departure,
      currency: "EUR",
      hl: "it",
      gl: "it",
      adults: String(Math.max(1, Math.min(6, Number(body.adults) || 1))),
      api_key: env.SERPAPI_KEY
    });
    if (body.outbound_date) params.set("outbound_date", String(body.outbound_date));
    if (body.return_date) params.set("return_date", String(body.return_date));
    const upstream = await fetch("https://serpapi.com/search.json?" + params.toString());
    const data = await upstream.json();
    if (!upstream.ok || data.error) {
      return new Response(JSON.stringify({
        error: "SerpApi non è riuscita a trovare le destinazioni",
        details: data.error || "Errore del provider"
      }), { status: 502, headers: cors });
    }
    return new Response(JSON.stringify({
      destinations: Array.isArray(data.destinations) ? data.destinations : [],
      search_metadata: data.search_metadata || {},
      search_parameters: data.search_parameters || {}
    }), { status: 200, headers: cors });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Errore durante la ricerca delle destinazioni" }), {
      status: 502, headers: cors
    });
  }
}
```

Dopo averlo inserito, premi **Deploy** in Cloudflare. Il codice non espone la chiave API: la legge dal secret `env.SERPAPI_KEY`.
