(function() {
  'use strict';

  angular.module('application', [
    'ui.router',
    'ngAnimate',

    //foundation
    'foundation',
    'foundation.dynamicRouting',
    'foundation.dynamicRouting.animations'
  ])
    .config(config)
    .run(run)
  ;

  config.$inject = ['$urlRouterProvider', '$locationProvider'];

  function config($urlProvider, $locationProvider) {
    $urlProvider.otherwise('/');

    $locationProvider.html5Mode({
      enabled:false,
      requireBase: false
    });

    $locationProvider.hashPrefix('!');
  }

  function run() {
    FastClick.attach(document.body);
  }

  function debounce(n,t,u){var e;return function(){var a=this,i=arguments,o=function(){e=null,u||n.apply(a,i)},r=u&&!e;clearTimeout(e),e=setTimeout(o,t),r&&n.apply(a,i)}}

  $(document).ready(function() {
    var gui = require('nw.gui'),
      win = gui.Window.get(),
      fs = require('fs'),
      walkr = require('walkr'),
      path = require('path'),
      settings = {};

    fs.readFile('./settings.json', 'utf-8', function (err, contents) {
      if(err || contents === '') {
        settings = {
          filesPath: 'C:/xampp/htdocs/StaticCMSContent/snippets',
          winWidth: 900,
          winHeight: 800,
          winX: 100,
          winY: 100,
          winIsFullscreen: false
        }
        fs.writeFile('./settings.json', JSON.stringify(settings));
      } else {
        settings = JSON.parse(contents);
      }
      $('#filesPath').val(settings.filesPath);
      win.resizeTo(settings.winWidth, settings.winHeight);
      win.moveTo(settings.winX, settings.winY);
      if(settings.winIsFullscreen) {
        win.enterFullscreen();
        $('[href="#enter-fullscreen"]').hide();
        $('[href="#leave-fullscreen"]').show();
      } else {
        $('[href="#enter-fullscreen"]').show();
        $('[href="#leave-fullscreen"]').hide();
      }
    });

    var saveWindowSettings = debounce(function() {
      console.log('saving');
      if($('#winSettings').prop('checked') && !win.isFullscreen) {
        settings.winWidth = win.width;
        settings.winHeight = win.height;
        settings.winX = win.x;
        settings.winY = win.y;
        fs.writeFile('./settings.json', JSON.stringify(settings));
      }
    }, 500);

    var saveWindowFullscreen = function() {
      if($('#winSettings').prop('checked')) {
        settings.winIsFullscreen = win.isFullscreen;
        fs.writeFile('./settings.json', JSON.stringify(settings));
      }
    }

    win.on('enter-fullscreen', saveWindowFullscreen);
    win.on('leave-fullscreen', saveWindowFullscreen);
    win.on('move', saveWindowSettings);
    win.on('resize', saveWindowSettings);

    $('[href="#close"]').on('click', function(e) {
      e.preventDefault();
      gui.App.quit();
    });
    $('[href="#enter-fullscreen"], [href="#leave-fullscreen"]').on('click', function(e) {
      e.preventDefault();
      if(win.isFullscreen) {
        win.leaveFullscreen();
      } else {
        win.enterFullscreen();
      }
      $('[href="#enter-fullscreen"], [href="#leave-fullscreen"]').toggle();
    });
    $('[href="#dev-tools"]').on('click', function(e) {
      e.preventDefault();
      if(win.isDevToolsOpen()) {
        win.closeDevTools();
      } else {
        win.showDevTools();
      }
    });
    $('#saver').on('click', function(e) {
      e.preventDefault();
      settings.filesPath = $('#filesPath').val();
      fs.writeFile('./settings.json', JSON.stringify(settings));
    });
    $('[href="/category-pages/header-cat-identifier"], [href="/toplevelcategorypage"], [href="/homepage"]')
      .on('click', function(e) {
        e.preventDefault();
        walkTheFiles($(this).attr('href'), $(this).data('bool'));
      });
    $('[href="dbquery"]').on('click', function(e) {
      e.preventDefault();
      $('#theContent').empty();
      var spawn = require('child_process').spawn,
          op = spawn('node', ['./assets/js/query.js']);

      op.stdout.setEncoding('utf8');

      op.stdout.on('data', function(data) {
        //console.log(data);
        data = JSON.parse(data);
        $.each(data, function(i) {
          $('#theContent')
            .append(
            $('<div />', {class: 'card'})
              .append(
              $('<div />', {class: 'card-divider', text: data[i].NAME}))
              .append(
              $('<div />', {class: 'card-section', html: data[i].MARKETINGTEXT})
            )
          );
        });
      });

      op.on('exit', function(code) {
        if(code > 0) {
          console.error('Oh no, there seems to be an error: ' + code);
        } else {
          console.log('Query complete.');
        }
      });
    });

    function walkTheFiles(path, underscore) {
      $('#theContent').empty();
      console.log(settings.filesPath + path);
      walkr(settings.filesPath + path)
        .on('directory', function(ops) {
          console.log(ops.source);
        })
        .on('file', function (file) {
          if(underscore) {
            if(file.name.split('.')[1].toLowerCase() === 'html' && file.name.indexOf('_') > 0) {
              //console.log(file.source);
              fs.readFile(file.source, 'utf-8', function (err, contents) {
                if(contents.indexOf('glam-slider') > 0) {
                  console.log(file.source);
                }
                $('#theContent')
                  .append(
                  $('<div />', {class: 'card'})
                  .append(
                    $('<div />', {class: 'card-divider', text: file.source}))
                  .append(
                    $('<div />', {class: 'card-section', html: contents
                      .replace('href="/media', 'href="http://www.horizonhobby.com/media')
                      .replace('src="//', 'src="http://')})
                  )
                );
              });
            }
          } else if(underscore === false) {
            if(file.name.split('.')[1].toLowerCase() === 'html' && file.name.length > 3) {
              //console.log(file.source);
              fs.readFile(file.source, 'utf-8', function (err, contents) {
                $('#theContent')
                  .append(
                  $('<div />', {class: 'card'})
                    .append(
                    $('<div />', {class: 'card-divider', text: file.source}))
                    .append(
                    $('<div />', {class: 'card-section', html: contents
                      .replace('href="/media', 'href="http://www.horizonhobby.com/media')
                      .replace('src="//', 'src="http://')})
                  )
                );
              });
            }
          } else {
            if(file.name.split('.')[1].toLowerCase() === 'html') {
              //console.log(file.source);
              fs.readFile(file.source, 'utf-8', function (err, contents) {
                $('#theContent')
                  .append(
                  $('<div />', {class: 'card'})
                    .append(
                    $('<div />', {class: 'card-divider', text: file.source}))
                    .append(
                    $('<div />', {class: 'card-section', html: contents
                      .replace('href="/media', 'href="http://www.horizonhobby.com/media')
                      .replace('src="//', 'src="http://')})
                  )
                );
              });
            }
          }
        }).
        start(function(err) {
          console.log('done!');
          $.getScript("./assets/js/glam-slider.js");
        });
    }

  });


})();
