import _ from 'lodash';
import Promise from 'bluebird';

export default function (els, fn) {
  var promises;

  if (!els.length) {
    return Promise.resolve();
  }

  promises = _.filter(els.map(fn));

  return Promise.all(promises);
}
