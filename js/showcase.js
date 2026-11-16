(function () {
  var KEY = "showcase-banner-dismissed";
  try { if (sessionStorage.getItem(KEY)) return; } catch (e) {}
  var bar = document.createElement("div");
  bar.className = "showcase-banner";
  bar.setAttribute("role", "note");
  bar.innerHTML = '<strong>Portfolio concept</strong><span>This is a design showcase, not the official Schultz Foundation website. Contact details are placeholders.</span><a class="showcase-credit" href="https://portfolio.enigmic.co.za/work/schultz-foundation" target="_blank" rel="noopener">Designed &amp; built by Enigmic &rarr;</a><button type="button" aria-label="Dismiss">&times;</button>';
  bar.querySelector("button").addEventListener("click", function () {
    bar.remove();
    try { sessionStorage.setItem(KEY, "1"); } catch (e) {}
  });
  document.body.appendChild(bar);
})();
