/** @type {import('gatsby').GatsbyNode["onPreInit"]} */
exports.onPreInit = (args, options) => {
  if (options.defaultDataLayer) {
    options.defaultDataLayer = {
      type: typeof options.defaultDataLayer,
      value: options.defaultDataLayer,
    };

    if (options.defaultDataLayer.type === `function`) {
      options.defaultDataLayer.value = options.defaultDataLayer.value.toString();
    }
  }
};

exports.pluginOptionsSchema = ({ Joi }) =>
  Joi.object({
    containerId: Joi.string().description(
      `Matomo Tag Manager container ID that can be found in your Tag Manager dashboard.`
    ),
    domain: Joi.string().description(
      `Matomo domain is the domain of your Matomo site.`
    ),
    includeInDevelopment: Joi.boolean()
      .default(false)
      .description(
        `Include Matomo Tag Manager when running in development mode.`
      ),
    defaultDataLayer: Joi.alternatives()
      .try(Joi.object(), Joi.function())
      .default(null)
      .description(
        `Data layer to be set before Matomo Tag Manager is loaded. Should be an object or a function.`
      ),
    dataLayerName: Joi.string().description(`Data layer name.`),
    routeChangeEventName: Joi.string()
      .default(`gatsby-route-change`)
      .description(
        `Name of the event that is triggered on every Gatsby route change.`
      ),
  });
