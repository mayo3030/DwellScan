const express = require('express');
const http = require('http');

const app = express();
const PORT = 8000;
const NEXT_HOST = '127.0.0.1';
const NEXT_PORT = 3000;

// Script to fix client-side navigation (pushState/replaceState)
const NAV_FIX_SCRIPT = `
<script>
(function() {
  var base = window.location.pathname;
  if (!base.endsWith('/')) base += '/';
  window.__PROXY_BASE__ = base;
  
  var origPush = history.pushState.bind(history);
  var origReplace = history.replaceState.bind(history);
  
  function fixUrl(url) {
    if (!url || typeof url !== 'string') return url;
    if (url.startsWith('/') && !url.startsWith(base)) {
      return base + url.slice(1);
    }
    return url;
  }
  
  history.pushState = function(s, t, u) { return origPush(s, t, fixUrl(u)); };
  history.replaceState = function(s, t, u) { return origReplace(s, t, fixUrl(u)); };
  
  // Intercept all link clicks
  document.addEventListener('click', function(e) {
    var a = e.target.closest('a');
    if (!a) return;
    var href = a.getAttribute('href');
    if (href && href.startsWith('/') && !href.startsWith('//') && !href.startsWith(base)) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      window.location.href = base + href.slice(1);
    }
  }, true);
})();
</script>`;

function rewriteBody(body) {
  return body
    // Rewrite asset paths
    .replace(/(href|src)="\/_next\//g, '$1="./_next/')
    // Rewrite RSC payload asset paths
    .replace(/\\\\"\/_next\//g, '\\\\"./_next/')
    .replace(/\\"\/_next\//g, '\\"./_next/')
    .replace(/HL\[\"\/_next\//g, 'HL["./_next/')
    // Rewrite nav links in the HTML body to relative
    .replace(/ href="\/(marketplace|pricing|about|login|register|dashboard|client|inspector|realtor|admin|api)/g, ' href="./$1')
    // Also rewrite in RSC payloads (escaped JSON)
    .replace(/\\"href\\":\s*\\"\//g, '\\"href\\":\\"./')
    .replace(/"href":"\/(?!\/)/g, '"href":"./')
    ;
}

app.use((req, res) => {
  const options = {
    hostname: NEXT_HOST,
    port: NEXT_PORT,
    path: req.url,
    method: req.method,
    headers: {
      ...req.headers,
      host: `${NEXT_HOST}:${NEXT_PORT}`,
      'accept-encoding': 'identity',
    },
  };

  const proxyReq = http.request(options, (proxyRes) => {
    const contentType = proxyRes.headers['content-type'] || '';
    
    if (contentType.includes('text/html') || contentType.includes('text/x-component')) {
      const chunks = [];
      proxyRes.on('data', chunk => chunks.push(chunk));
      proxyRes.on('end', () => {
        let body = Buffer.concat(chunks).toString('utf8');
        body = rewriteBody(body);
        
        // Inject nav fix script for HTML pages
        if (contentType.includes('text/html')) {
          body = body.replace('<head>', '<head>' + NAV_FIX_SCRIPT);
        }
        
        const headers = { ...proxyRes.headers };
        delete headers['content-encoding'];
        delete headers['content-length'];
        delete headers['transfer-encoding'];
        
        Object.keys(headers).forEach(key => {
          try { res.setHeader(key, headers[key]); } catch(e) {}
        });
        
        res.status(proxyRes.statusCode);
        res.end(body);
      });
    } else if (contentType.includes('javascript') || contentType.includes('application/javascript') || req.url.includes('.js')) {
      // Rewrite webpack public path in JS chunks
      const chunks = [];
      proxyRes.on('data', chunk => chunks.push(chunk));
      proxyRes.on('end', () => {
        let body = Buffer.concat(chunks).toString('utf8');
        // Fix webpack public path from absolute to relative
        body = body.replace(/__webpack_require__\.p\s*=\s*"\/_next\/"/g, '__webpack_require__.p = "./_next/"');
        // Also fix any hardcoded /_next/ references in chunk loading
        body = body.replace(/"\/_next\//g, '"./_next/');
        
        const headers = { ...proxyRes.headers };
        delete headers['content-encoding'];
        delete headers['content-length'];
        delete headers['transfer-encoding'];
        Object.keys(headers).forEach(key => {
          try { res.setHeader(key, headers[key]); } catch(e) {}
        });
        res.status(proxyRes.statusCode);
        res.end(body);
      });
    } else {
      const headers = { ...proxyRes.headers };
      Object.keys(headers).forEach(key => {
        try { res.setHeader(key, headers[key]); } catch(e) {}
      });
      res.status(proxyRes.statusCode);
      proxyRes.pipe(res);
    }
  });

  proxyReq.on('error', (err) => {
    console.error('Proxy error:', err.message);
    res.status(502).send('Proxy Error');
  });

  req.pipe(proxyReq);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Proxy server running on port ${PORT}`);
});
