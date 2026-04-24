import utils from 'shipit-utils';
import chalk from 'chalk';
import util from 'node:util';
import path from 'node:path/posix';
import _ from 'lodash';
import init from '../../lib/init.js';
import mapPromise from '../../lib/map-promise.js';

/**
 * Create required directories for linked files and dirs.
 */

export default function (gruntOrShipit) {

  var task = function task() {
    var shipit = utils.getShipit(gruntOrShipit);

    var setPermissions = function setPermissions(el) {
      var filePath = shipit.config.shared.remote ? path.join(shipit.config.shared.basePath, el.path) : el.path;

      if (el.chmod) {
        return shipit[shipit.config.shared.shipitMethod](util.format('chmod %s', el.chmod, filePath))
        .catch(function(e) {
          console.log(chalk.bold.red('\nError: ' + e.message));
        });
      }

      return false;
    };

    return init(shipit).then(function(shipit) {
      shipit.log(util.format('Setting permissions on %s.', shipit.config.shared.shipitMethod));

      return mapPromise(shipit.config.shared.dirs, setPermissions)
      .then(function() {
        return mapPromise(shipit.config.shared.files, setPermissions);
      })
      .then(function() {
        shipit.log(chalk.green(util.format('Permissions set on %s.', shipit.config.shared.shipitMethod)));
      })
      .then(function() {
        shipit.emit('sharedPermissionsSet');
      });

    });
  };

  utils.registerTask(gruntOrShipit, 'shared:set-permissions', task);
}
