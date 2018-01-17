AUI().ready(
  'aui-base',
  function(A) {

    var elBody = A.one('body');

    // Custom admin controls body classes
    var CSS_CLASS_CONTROLS_CLOSED = 'custom-admin-controls-closed';
    var CSS_CLASS_CONTROLS_OPEN = 'custom-admin-controls-open';

    // Custom admin controls Liferay.Store key
    var LIFERAY_STORE_CONTROLS_KEY = 'custom-admin-controls';

    // Toggle Button css classes
    var CSS_CLASS_JS_TOGGLE_ADMIN_MODE = 'js-toggle-admin-mode';
    var CSS_CLASS_TOGGLE_ADMIN_MODE = 'toggle-admin-mode';

    // Toggle Button pen icon SVG path
    var SVG_PATH_PEN_PART_1 = 'M30.276 1.722C29.168.612 27.69 0 26.12 0s-3.044.61-4.153 1.72L4.294 19.29c-.105.105-.185.23-.235.368l-4 11c-.13.355-.05.756.21 1.03.19.204.46.312.73.312.09 0 .19-.014.29-.044l9.95-3.052c.15-.047.29-.133.41-.248l18.62-18.62c1.12-1.11 1.73-2.59 1.73-4.16 0-1.57-.61-3.045-1.73-4.155zM10.092 27.165L6.368 28.31c-.217-.638-.555-1.202-1.016-1.663-.4-.4-.866-.71-1.356-.96L5.7 21H8v2c0 ';
    var SVG_PATH_PEN_PART_2 = '.553.447 1 1 1h1.765l-.673 3.165zm14.72-14.494L12.628 24.86l.35-1.647c.062-.296-.012-.603-.202-.837-.19-.234-.475-.37-.776-.37h-2v-2c0-.552-.448-1-1-1H7.422l11.893-11.83.012.01c.732-.733 1.707-1.136 2.742-1.136s2.01.403 2.74 1.136 1.14 1.707 1.14 2.743c0 1.03-.41 2-1.14 2.74zm4.05-4.05l-.932.94c-.09-1.43-.683-2.76-1.703-3.78s-2.354-1.61-3.787-1.7l.938-.93h.002C24.11 2.406 25.085 ';
    var SVG_PATH_PEN_PART_3 = '2 26.12 2s2.01.403 2.742 1.136C29.596 3.87 30 4.843 30 5.878c0 1.037-.402 2.01-1.138 2.743zm-6.57-.32l-10 10c-.39.39-.39 1.03 0 1.42.195.196.452.294.708.294s.51-.097.707-.292l10-10c.39-.39.39-1.02 0-1.412-.392-.39-1.023-.39-1.414 0z';
    var SVG_PATH_PEN = SVG_PATH_PEN_PART_1 + SVG_PATH_PEN_PART_2 + SVG_PATH_PEN_PART_3;

    // Toggle button html / fragment
    var adminControlHtml =  '<div class="' + CSS_CLASS_JS_TOGGLE_ADMIN_MODE + ' ' + CSS_CLASS_TOGGLE_ADMIN_MODE + '">'
    adminControlHtml +=       '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32">';
    adminControlHtml +=         '<path d="' + SVG_PATH_PEN + '" />';
    adminControlHtml +=       '</svg>';
    adminControlHtml +=     '</div>';

    elBody.append(adminControlHtml);

    // Find element product menu and toggle button
    var elProductMenu = elBody.one('.lfr-product-menu-panel');
    var elToggleButton = elBody.one('.' + CSS_CLASS_JS_TOGGLE_ADMIN_MODE);

    // Make sure Liferay object is available
    if(!(Liferay)) {
      return;
    }

    // No product menu exists
    if(!elProductMenu) {
      return;
    }
    // No toggle button exists
    if(!elToggleButton) {
      return;
    }

    if(elBody.hasClass(CSS_CLASS_CONTROLS_CLOSED)) {
      elBody.removeClass('open');
      elBody.removeClass('has-control-menu');
      elBody.removeClass('controls-visible');

      elBody.addClass('controls-hidden');
      elBody.addClass('closed');

      elProductMenu.removeClass('open');
      elProductMenu.addClass('closed');

    }

    elToggleButton.addClass('show');

    elToggleButton.on('click', toggleControlMenu);

    getSessionClickData(LIFERAY_STORE_CONTROLS_KEY);

    function toggleControlMenu() {
      if(elBody.hasClass(CSS_CLASS_CONTROLS_CLOSED)) {
        elBody.removeClass(CSS_CLASS_CONTROLS_CLOSED);

        elBody.addClass('has-control-menu');
        elBody.addClass('controls-visible');
        elBody.removeClass('controls-hidden');

        elBody.addClass(CSS_CLASS_CONTROLS_OPEN);
        Liferay.Store(LIFERAY_STORE_CONTROLS_KEY, CSS_CLASS_CONTROLS_OPEN);
      } else if(elBody.hasClass(CSS_CLASS_CONTROLS_OPEN)) {
        elBody.removeClass(CSS_CLASS_CONTROLS_OPEN);

        elBody.removeClass('has-control-menu');
        elBody.removeClass('controls-visible');
        elBody.removeClass('open');
        elBody.addClass('controls-hidden');
        elBody.addClass('closed');

        elBody.addClass(CSS_CLASS_CONTROLS_CLOSED);
        Liferay.Store(LIFERAY_STORE_CONTROLS_KEY, CSS_CLASS_CONTROLS_CLOSED);
      }
    }

    function getSessionClickData(key) {


      invokeSessionClick(
        {
          cmd: 'get',
          key: key
        },
        function(responseData) {
          var responseJSON;

          try {
            responseJSON = JSON.parse(responseData);
          }
          catch (e) {
          }

          console.log(responseJSON);

          // updatePaginationMap(paginationMap, target);
          //
          // target.eachParent(
          //   function(parent) {
          //     updatePaginationMap(paginationMap, parent);
          //   }
          // );
          //
          // var sessionClickData = {};
          //
          // sessionClickData[key] = JSON.stringify(paginationMap);
          //
          // instance._invokeSessionClick(sessionClickData);
        }
      );



    }


    function invokeSessionClick(data, callback) {
      A.mix(
        data,
        {
          p_auth: Liferay.authToken,
          useHttpSession: true
        }
      );

      A.io.request(
        themeDisplay.getPathMain() + '/portal/session_click',
        {
          after: {
            success: function(event) {
              var instance = this;

              var responseData = instance.get('responseData');

              console.log('invokeSessionClick success. ');
              console.log('responseData: ', responseData);

              if (callback && responseData) {
                callback(responseData);
              }
            }
          },
          data: data
        }
      );
    }






  }
);
