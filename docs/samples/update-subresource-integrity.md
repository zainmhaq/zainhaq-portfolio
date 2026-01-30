# Update Subresource Integrity (SRI) hash values for scripts in the cartridge

To help prevent script tampering and ensure checkout processes work correctly, when you modify any file in the cartridge, generate and update Subresource Integrity (SRI) hash values for the scripts in the cartridge.

## Automatically generate new SRI hash values when building the cartridge

1. Install the required packages. In version 0.13.0 and later, the cartridge includes these packages by default.

```bash
npm install webpack-assets-manifest@4.0.0 --save
npm install webpack-subresource-integrity@1.5.2 --save
```

2. In `webpack.config.js`, require the plugins. In version 0.13.0 and later, the cartridge includes these plugins by default.

```js
var path = require('path');
const SubresourceIntegrityPlugin = require('webpack-subresource-integrity');
const WebpackAssetsManifest = require('webpack-assets-manifest');
```

3. In the `plugins` array of the JavaScript configuration object, add instances of the plugins as follows. In version 0.13.0 and later, the cartridge includes these instances by default.

```js
plugins: [
  new SubresourceIntegrityPlugin({
    hashFuncNames: ['sha384']
  }),
  new WebpackAssetsManifest({
    integrity: true,
    integrityHashes: ['sha384'],
    writeToDisk: true,
    output: 'js-asset-manifest.json'
  })
]
```

## Generate the `js-asset-manifest.json` file

The `webpack-assets-manifest` package generates `js-asset-manifest.json`, which includes SHA-384 SRI hash values for each affected script.

1. In a terminal, open your cartridge directory and build the cartridge.
2. After the build completes, find `js-asset-manifest.json` at:

```
link_amazon_bwp/cartridges/int_buywithprime/cartridge/static/
```

## Update SRI hash values for scripts in the cartridge

When the cartridge loads a checkout script, it verifies the SRI by checking whether the new SRI hash value matches the expected SRI hash value.

### Update the SRI hash value for `bwpSummary.js`

1. Open:

```
link_amazon_bwp/cartridges/int_buywithprime_sfra/cartridge/templates/default/checkout/checkout.isml
```

2. In the **Load Static Assets** section, find the line that references `bwpSummary.js`.
3. In `js-asset-manifest.json`, copy the new SRI hash value for the `bwpSummary.js` entry under the `integrity` key (keep the `sha384-` prefix).
4. In `checkout.isml`, replace the existing SRI hash value with the new value and keep the `sha384-` prefix.
5. Save `checkout.isml`.

Example:

```js
assets.addJs('/js/bwpSummary.js', 'sha384-xyZ123dEf456GhI789jKl+012MnO345pQr678sTu901vWx234yZa567bCd890EfG');
```

### Update the SRI hash values for `clickstreamLoader.js` and `buywithprime.js`

1. Open:

```
link_amazon_bwp/cartridges/int_buywithprime/cartridge/scripts/amazon/hooks/htmlHooks.js
```

2. In the `htmlHead` function, find the script references.
3. In `js-asset-manifest.json`, copy the new SRI hash values for the `clickstreamLoader.js` and `buywithprime.js` entries under the `integrity` key (keep the `sha384-` prefix).
4. Replace both SRI hash values in `htmlHooks.js` with their corresponding new values and keep the `sha384-` prefix.
5. Save `htmlHooks.js`.

Example:

```js
// clickstreamLoader.js hash
Velocity.render('<script defer src="$url" integrity="sha384-abC123dEf456GhI789jKl+012MnO345pQr678sTu901vWx234yZa567bCd890EfG"></script>', {
  url: URLUtils.staticURL('/js/clickstreamLoader.js')
});

// buywithprime.js hash
Velocity.render('<script defer src="$url" integrity="sha384-abC123dEf456GhI789jKl+012MnO345pQr678sTu901vWx234yZa567bCd890EfG"></script>', {
  url: URLUtils.staticURL('/js/buywithprime.js').toString()
});
```

Example manifest entries:

```json
"default/js/clickstreamLoader.js": {
  "src": "default/js/clickstreamLoader.js",
  "integrity": "sha384-abC123dEf456GhI789jKl+012MnO345pQr678sTu901vWx234yZa567bCd890EfG"
},
"default/js/buywithprime.js": {
  "src": "default/js/buywithprime.js",
  "integrity": "sha384-xyZ123aBC456GhI789jKl+012MnO345pQr678sTu901vWx234yZa567bCd890EfG"
}
```

## Generate new SRI hash values manually

If your configuration requires building the cartridge separately, you might need to generate new SRI hash values manually. For background and procedures, refer to Mozilla documentation on Subresource Integrity.
