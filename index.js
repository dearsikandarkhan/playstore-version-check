const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const port = process.env.PORT || 3000;
const playUrl = 'https://play.google.com/store/apps/details?id=';
const userAgent =
  'Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.87 Mobile Safari/537.36';

// Try to extract version from JSON-LD script tag
function extractFromJsonLd($) {
  const scripts = $('script[type="application/ld+json"]');
  for (let i = 0; i < scripts.length; i++) {
    const text = $(scripts[i]).contents().text();
    if (!text) continue;
    try {
      const data = JSON.parse(text);
      // The LD+JSON sometimes is an object or an array
      const candidates = Array.isArray(data) ? data : [data];
      for (const item of candidates) {
        if (item.softwareVersion) return item.softwareVersion;
        if (item.version) return item.version;
      }
    } catch (err) {
      // ignore JSON parse errors and continue
    }
  }
  return null;
}

// Try to extract version by looking for the "Current Version" label (more resilient than hard-coded index)
function extractByLabel($) {
  // Play Store often uses div.hAyfc blocks where .BgcNfc is the label and .htlgb contains the value
  const blocks = $('div.hAyfc');
  for (let i = 0; i < blocks.length; i++) {
    const label = $(blocks[i]).find('.BgcNfc').text().trim();
    if (!label) continue;
    // label could be "Current Version" in English; if you expect other locales you may add them here
    if (label === 'Current Version' || label === 'Current version' || label.toLowerCase().includes('version')) {
      const value = $(blocks[i]).find('.htlgb').first().text().trim();
      if (value) return value;
    }
  }
  return null;
}

// Last-resort fallback (the brittle approach used in the original code)
function extractByIndex($) {
  const el = $('.htlgb').eq(6);
  if (el && el.text()) return el.text().trim();
  return null;
}

async function fetchVersion(packageName) {
  const url = playUrl + packageName;
  const headers = { 'User-Agent': userAgent };
  // allow non-2xx (we'll handle 404 specially)
  const axiosOptions = { headers, timeout: 10000, validateStatus: (s) => s < 500 };

  const resp = await axios.get(url, axiosOptions);
  if (resp.status === 404) {
    const err = new Error('Package not found');
    err.code = 'NOT_FOUND';
    throw err;
  }
  const body = resp.data;
  const $ = cheerio.load(body);

  // 1) JSON-LD
  let version = extractFromJsonLd($);

  // 2) label-based
  if (!version) version = extractByLabel($);

  // 3) brittle index fallback
  if (!version) version = extractByIndex($);

  if (!version) {
    const err = new Error('Version not found (page layout may have changed)');
    err.code = 'PARSE_FAILED';
    throw err;
  }

  if (version === 'Varies with device') version = '0.0.0';
  return version;
}

app.get('/:packageName', async (req, res) => {
  const pkg = req.params.packageName;
  try {
    const version = await fetchVersion(pkg);
    res.json({ bundleId: pkg, version });
  } catch (err) {
    console.error('Error fetching version for', pkg, err && err.message);
    if (err.code === 'NOT_FOUND') return res.status(404).json({ error: 'Package not found' });
    if (err.code === 'PARSE_FAILED') return res.status(502).json({ error: 'Could not parse Play Store page' });
    return res.status(500).json({ error: 'Error retrieving app information' });
  }
});

app.listen(port, () => console.log('Listening on :' + port));
