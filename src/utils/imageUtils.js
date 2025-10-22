// Utilities to add image error handling and disable image links inside generated HTML
// These functions run in the browser (client-side) and are safe to use inside components

/**
 * Analyze HTML string, add lazy loading to images and mark anchors that contain images.
 * This does not perform network requests (CORS may prevent that) — instead it prepares
 * the HTML for runtime handling by `addImageErrorHandling` which injects the script
 * that replaces broken images and disables clicks on anchors containing images.
 *
 * @param {string} html - Raw HTML string returned by the AI
 * @returns {Promise<{html: string, fixedCount: number}>} - Modified HTML and count of <img> tags found
 */
export async function fixBrokenImages(html) {
  if (typeof window === 'undefined' || !html) {
    // If not running in browser (or empty html), return as-is
    const count = (html && (html.match(/<img\b/gi) || []).length) || 0;
    return { html: html || '', fixedCount: count };
  }

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    const imgs = Array.from(doc.querySelectorAll('img'));
    imgs.forEach((img) => {
      // Ensure lazy loading and remove potentially dangerous inline handlers
      img.setAttribute('loading', img.getAttribute('loading') || 'lazy');
      img.removeAttribute('onerror');
      img.removeAttribute('onclick');
      // Add a data attribute we can use later in the runtime script
      if (!img.hasAttribute('data-compailer')) img.setAttribute('data-compailer', '1');
    });

    // Disable anchors that directly contain images by moving href to data-disabled-href
    const anchors = Array.from(doc.querySelectorAll('a'));
    anchors.forEach((a) => {
      if (a.querySelector('img')) {
        const href = a.getAttribute('href');
        if (href) {
          a.setAttribute('data-disabled-href', href);
          a.removeAttribute('href');
        }
        // mark for runtime script
        if (!a.hasAttribute('data-compailer')) a.setAttribute('data-compailer', '1');
      }
    });

    const serializer = new XMLSerializer();
    const newHtml = serializer.serializeToString(doc);
    return { html: newHtml, fixedCount: imgs.length };
  } catch (error) {
    // Fallback: try a simple regex-based count and return original html
    console.warn('Error processing HTML:', error);
    const count = (html.match(/<img\b/gi) || []).length;
    return { html, fixedCount: count };
  }
}

/**
 * Injects a small runtime script and styles into the provided HTML that:
 * - attaches an `error` handler to images to replace broken images with an inline SVG placeholder
 * - disables clicks/navigation for anchors that contain images (anchors will have `data-disabled-href`)
 *
 * This function keeps the original markup intact and inserts the script before </body> when possible,
 * or appends it to the end of the HTML string.
 *
 * @param {string} html
 * @returns {string} modified html with the runtime snippet injected
 */
export function addImageErrorHandling(html) {
  if (!html) return html;

  const snippet = `\n<!-- CompAIler image handling (injected) -->\n<style>\n.compailer-broken-img{display:inline-block;background:#f3f3f3;color:#666;object-fit:contain;min-width:80px;min-height:50px}\n.compailer-img-disabled-anchor{cursor:default;text-decoration:none}\n</style>\n<script>\n(function(){\n  if(window.__compailer_image_handling_installed) return;\n  window.__compailer_image_handling_installed = true;\n\n  function replaceBrokenImage(img){\n    try{\n      if(img.dataset && img.dataset.compailerPlaceholder) return;\n      img.dataset.compailerPlaceholder = '1';\n      var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="100%" height="100%" fill="%23f3f3f3"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23666" font-family="Arial, Helvetica, sans-serif" font-size="16">Image not found</text></svg>';
      img.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);\n      img.classList.add('compailer-broken-img');\n    }catch(e){}\n  }\n\n  function handleImages(){\n    var imgs = document.querySelectorAll('img[data-compailer]');\n    imgs.forEach(function(img){\n      // Attach error handler only once\n      if(!img.__compailer_error_attached){\n        img.addEventListener('error', function(){ replaceBrokenImage(img); });\n        img.addEventListener('load', function(){ /* remove placeholder marker if loaded */ });\n        img.__compailer_error_attached = true;\n      }\n      // If already broken (cached), trigger handler if naturalWidth==0\n      try{ if(img.complete && img.naturalWidth === 0) replaceBrokenImage(img); }catch(e){}\n    });\n\n    // Disable anchors that contain images
    var anchors = document.querySelectorAll('a[data-compailer]');\n    anchors.forEach(function(a){\n      if(!a.__compailer_anchor_disabled){\n        a.addEventListener('click', function(e){ e.preventDefault(); });\n        a.classList.add('compailer-img-disabled-anchor');\n        a.__compailer_anchor_disabled = true;\n      }\n    });\n  }\n\n  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', handleImages); else handleImages();\n  // Also run after a short delay to catch late-inserted content
  setTimeout(handleImages, 500);
})();\n</script>\n<!-- /CompAIler image handling -->\n`;

  // Try to insert before </body>
  const bodyClose = /<\/body>/i;
  if (bodyClose.test(html)) {
    return html.replace(bodyClose, snippet + '</body>');
  }

  // If there's a </html> tag, insert before it
  const htmlClose = /<\/html>/i;
  if (htmlClose.test(html)) {
    return html.replace(htmlClose, snippet + '</html>');
  }

  // Otherwise append at the end
  return html + snippet;
}

export default { fixBrokenImages, addImageErrorHandling };