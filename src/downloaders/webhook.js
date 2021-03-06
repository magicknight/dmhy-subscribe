const axios = require('axios');
const { print, l10n } = require('../..');
const crypto = require('crypto');

module.exports = (thread, config) => {
  print.debug('dmhy:downloaders:webhook:thread', thread);
  print.debug('dmhy:downloaders:webhook:config', config);

  const tok = crypto
    .createHash('sha1')
    .update(config['webhook-token'])
    .digest('hex');
  return axios
    .post(config['webhook-url'], thread, {
      headers: {
        'x-dmhy-token': tok,
      },
    })
    .then(() => print.success(l10n('DOWNLOADER_DL_SUCCESS', { title: thread.title })))
    .catch(() => print.error(l10n('DOWNLOADER_DL_FAILED', { title: thread.title })));
};
