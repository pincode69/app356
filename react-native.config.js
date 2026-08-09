const linkAssets = require('@react-native-community/cli-link-assets');

module.exports = {
  commands: [linkAssets.commands.linkAssets],
  assets: ['./assets/fonts'],
};
