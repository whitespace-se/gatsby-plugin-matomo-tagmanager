import React from "react";
import { oneLine, stripIndent } from "common-tags";

const generateMTM = ({ containerId, domain, dataLayerName }) => stripIndent`
var _mtm = window._mtm = window._mtm || [];
_mtm.push({'mtm.startTime': (new Date().getTime()), 'event': 'mtm.Start'});
var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
g.type='text/javascript'; g.async=true; g.src='https://${domain}/js/container_${containerId}.js'; s.parentNode.insertBefore(g,s);`;

// (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
// new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
// j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
// 'https://www.googletagmanager.com/gtm.js?id='+i+dl+'${environmentParamStr}';f.parentNode.insertBefore(j,f);
// })(window,document,'script','${dataLayerName}', '${id}');`;

const generateDefaultDataLayer = (dataLayer, reporter, dataLayerName) => {
  let result = `window.${dataLayerName} = window.${dataLayerName} || [];`;

  if (dataLayer.type === `function`) {
    result += `window.${dataLayerName}.push((${dataLayer.value})());`;
  } else {
    if (dataLayer.type !== `object` || dataLayer.value.constructor !== Object) {
      reporter.panic(
        `Oops the plugin option "defaultDataLayer" should be a plain object. "${dataLayer}" is not valid.`
      );
    }

    result += `window.${dataLayerName}.push(${JSON.stringify(
      dataLayer.value
    )});`;
  }

  return stripIndent`${result}`;
};

exports.onRenderBody = (
  { setHeadComponents, reporter },
  {
    containerId,
    domain,
    includeInDevelopment = false,
    defaultDataLayer,
    dataLayerName = `dataLayer`,
  }
) => {
  if (process.env.NODE_ENV === `production` || includeInDevelopment) {
    let defaultDataLayerCode = ``;
    if (defaultDataLayer) {
      defaultDataLayerCode = generateDefaultDataLayer(
        defaultDataLayer,
        reporter,
        dataLayerName
      );
    }

    setHeadComponents([
      <script
        key="plugin-matomo-tagmanager"
        dangerouslySetInnerHTML={{
          __html: oneLine`
            ${defaultDataLayerCode}
            ${generateMTM({ containerId, domain, dataLayerName })}`,
        }}
      />,
    ]);
  }
};
