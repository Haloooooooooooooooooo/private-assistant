const http = require("http");
const fs = require("fs");
const path = require("path");

const root = __dirname;
const port = Number(process.env.PORT || 61291);

const server = http.createServer((req, res) => {
  const urlPath = req.url === "/" ? "/content/layout-options.html" : req.url;
  const filePath = path.join(root, decodeURIComponent(urlPath.split("?")[0]));

  if (!filePath.startsWith(root)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  fs.readFile(filePath, "utf8", (err, body) => {
    if (err) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }
    if (!body.trimStart().startsWith("<!DOCTYPE") && !body.trimStart().startsWith("<html")) {
      body = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>UI Layout Companion</title>
  <style>
    body { margin: 0; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background: #f6f7fb; color: #172033; }
    main { max-width: 1180px; margin: 0 auto; padding: 36px 24px 56px; }
    h2 { margin: 0 0 8px; font-size: 28px; letter-spacing: 0; }
    h3 { margin: 0 0 8px; font-size: 17px; letter-spacing: 0; }
    p { line-height: 1.55; }
    .subtitle { margin: 0 0 24px; color: #647084; }
    .cards { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 18px; }
    .card { background: white; border: 1px solid #d9dee8; border-radius: 10px; overflow: hidden; cursor: pointer; box-shadow: 0 8px 24px rgba(15, 23, 42, .06); transition: transform .15s ease, border-color .15s ease, box-shadow .15s ease; }
    .card:hover { transform: translateY(-2px); border-color: #8ea4c8; }
    .card.selected { border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37,99,235,.14), 0 10px 28px rgba(15,23,42,.1); }
    .card-image { padding: 12px; background: #eef2f7; }
    .card-body { padding: 16px; }
    .card-body p { margin: 0; color: #5d6a7e; }
    .section { margin-top: 22px; background: #fff; border: 1px solid #d9dee8; border-radius: 10px; padding: 18px; }
    @media (max-width: 980px) { .cards { grid-template-columns: 1fr; } }
  </style>
</head>
<body>
  <main>${body}</main>
  <script>
    function toggleSelect(el) {
      document.querySelectorAll(".card").forEach(card => card.classList.remove("selected"));
      el.classList.add("selected");
    }
  </script>
</body>
</html>`;
    }
    res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
    res.end(body);
  });
});

server.listen(port, "127.0.0.1", () => {
  console.log(`UI layout companion: http://localhost:${port}/`);
});
