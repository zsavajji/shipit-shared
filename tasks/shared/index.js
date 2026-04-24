import utils from 'shipit-utils';
import createDirs from './create-dirs.js';
import setPermissions from './set-permissions.js';
import link from './link.js';

/**
 * Symlink shared files and directories.
 */

export default function (gruntOrShipit) {
  var shipit = utils.getShipit(gruntOrShipit);
  createDirs(gruntOrShipit);
  setPermissions(gruntOrShipit);
  link(gruntOrShipit);

  utils.registerTask(gruntOrShipit, 'shared', [
    'shared:prepare',
    'shared:link',
    'shared:end',
  ]);

  utils.registerTask(gruntOrShipit, 'shared:prepare', [
    'shared:create-dirs',
    'shared:set-permissions',
  ]);

  // Until utils.registerTask can accept a callback...
  utils.registerTask(gruntOrShipit, 'shared:end', function() {
    shipit.emit('sharedEnd');
  });

  // Trigger on deploy by default
  shipit.on('init', function() {
    shipit.config.shared = shipit.config.shared || {};
    var event = shipit.config.shared.triggerEvent;
    event = event !== undefined ? event : 'updated';

    if (event) {
      shipit.on(event, function() {
        utils.runTask(gruntOrShipit, 'shared');
      });
    }
  });
}
