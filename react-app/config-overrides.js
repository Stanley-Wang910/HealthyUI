const TerserPlugin = require('terser-webpack-plugin')
module.exports = function override(config, env) {
  // Disable minification
  config.optimization.minimize = false

  // Disable any existing minimizers
  // if (config.optimization) {
  //   config.optimization.minimize = false // Explicitly set minimize to false
  //   config.optimization.minimizer = config.optimization.minimizer.map(
  //     (plugin) => {
  //       if (plugin instanceof TerserPlugin) {
  //         plugin.options.terserOptions.compress = false // Disable compression
  //         plugin.options.terserOptions.mangle = false // Disable mangling
  //       }
  //       return plugin
  //     }
  //   )
  // }

  // Optional: Disable generating additional chunks
  if (config.optimization && config.optimization.splitChunks) {
    config.optimization.splitChunks = {
      cacheGroups: {
        default: false
      }
    }
  }

  // Optional: Disable runtime chunk
  if (config.optimization && config.optimization.runtimeChunk) {
    config.optimization.runtimeChunk = false
  }

  config.output.publicPath = '/react-build/'

  // Remove hash from filenames
  // config.output.filename = 'static/js/[name].js'
  // config.output.chunkFilename = 'static/js/[name].chunk.js'
  //
  // // Modify CSS output filenames
  // config.plugins.forEach((plugin) => {
  //   if (plugin.constructor.name === 'MiniCssExtractPlugin') {
  //     plugin.options.filename = 'static/css/[name].css'
  //     plugin.options.chunkFilename = 'static/css/[name].chunk.css'
  //   }
  // })

  return config
}
