/*
 * Copyright 2016 Resin.io
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

const _ = require('lodash');
const fs = require('fs');
const electron = require('electron');

module.exports = function($q, SupportedFormatsModel) {

  /**
   * @summary Open an image selection dialog
   * @function
   * @public
   *
   * @description
   * Notice that by image, we mean *.img/*.iso/*.zip/etc files.
   *
   * @fulfil {Object} - selected image
   * @returns {Promise};
   *
   * @example
   * OSDialogService.selectImage().then(function(image) {
   *   console.log('The selected image is', image.path);
   * });
   */
  this.selectImage = function() {
    return $q(function(resolve, reject) {
      electron.remote.dialog.showOpenDialog({
        properties: [
          'openFile'
        ],
        filters: [
          {
            name: 'OS Images',
            extensions: SupportedFormatsModel.getAllExtensions()
          }
        ]
      }, function(files) {

        // `_.first` is smart enough to not throw and return `undefined`
        // if we pass it an `undefined` value (e.g: when the selection
        // dialog was cancelled).
        const imagePath = _.first(files);

        if (!imagePath) {
          return resolve();
        }

        fs.stat(imagePath, function(error, stats) {

          if (error) {
            return reject(error);
          }

          return resolve({
            path: imagePath,
            size: stats.size
          });
        });
      });
    });
  };

  /**
   * @summary Show error dialog for an Error instance
   * @function
   * @public
   *
   * @param {Error} error - error
   *
   * @example
   * OSDialogService.showError(new Error('Foo Bar'));
   */
  this.showError = function(error) {
    error = error || {};
    electron.remote.dialog.showErrorBox(error.message || 'An error ocurred!', error.stack || '');

    // Also throw it so it gets displayed in DevTools
    // and its reported by TrackJS.
    throw error;

  };

};
