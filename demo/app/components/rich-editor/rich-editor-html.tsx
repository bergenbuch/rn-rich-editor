export const RichtEditorHtml = `<!DOCTYPE html>
<html>
  <head>
    <meta
      name="viewport"
      content="user-scalable=1.0,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0"
    />
    <style>
      * {
        outline: 0px solid transparent;
        -webkit-tap-highlight-color: #000000;
        -webkit-touch-callout: none;
        -webkit-overflow-scrolling: touch;
      }
      html,
      body {
        flex: 1;
        outline: 0;
        padding: 0;
        margin: 0;
        font-family: '-apple-system', 'HelveticaNeue', Helvetica, Roboto, Arial,
          sans-serif;
        font-size: 1em;
        color: #000000;

        height: 100%;
        min-height: 100%;

        overflow: hidden;
      }

      .editor,
      .content {
        outline: 0;
        padding: 0;
        margin: 0;
        height: 100%;
        min-height: 100%;
      }

      .content {
        padding: 1em;
      }

      [placeholder]:empty:before,
      [placeholder]:empty:focus:before {
        content: attr(placeholder);
        color: #d1d1d1;
      }

      [contenteditable] {
        -webkit-user-select: text;
        user-select: text;
      }
    </style>
  </head>

  <body>
    <div class="editor"></div>
    <script>
      (function (exports) {
        var editor = null;

        var postToWebView = function (data) {
          if (
            data !== null &&
            typeof data !== 'undefined' &&
            window.ReactNativeWebView &&
            typeof window.ReactNativeWebView.postMessage === 'function'
          ) {
            window.ReactNativeWebView.postMessage(JSON.stringify(data));
          }
        };

        var messagesToWebView = (function () {
          var initialized = function () {
            return {name: 'initialized'};
          };
          var returnHtml = function (data) {
            return {name: 'returnHtml', data: data};
          };
          return {initialized: initialized, returnHtml: returnHtml};
        })();

        var plugMessagesFromWebView = function (content, exports) {
          var setHtml = (html) => {
            content.innerHTML = html;
          };

          var setPlaceholder = function (text) {
            content.setAttribute('placeholder', text);
          };

          var getHtml = function () {
            postToWebView(messagesToWebView.returnHtml(content.innerHTML));
          };

          var bold = function () {
            document.execCommand('bold');
          };

          var italic = function () {
            document.execCommand('italic');
          };

          var underline = function () {
            document.execCommand('underline');
          };

          exports.messagesFromWebView = {
            setHtml: setHtml,
            setPlaceholder: setPlaceholder,
            getHtml: getHtml,
            bold: bold,
            italic: italic,
            underline: underline,
          };
        };

        var init = function (element) {
          var content = document.createElement('div');
          content.contentEditable = true;
          content.spellcheck = false;
          content.autocapitalize = 'off';
          content.autocorrect = 'off';
          content.autocomplete = 'off';
          content.className = 'content';
          element.appendChild(content);

          plugMessagesFromWebView(content, exports);
          var message = function (event) {
            var messageData = JSON.parse(event.data);
            exports.messagesFromWebView[messageData.name](messageData.data);
          };
          var onMessage = function (event) {
            var message = JSON.parse(event.data);

            exports.messagesFromWebView[message.name](message.data);
          };
          document.addEventListener('message', onMessage);
          exports.addEventListener('message', onMessage);
          postToWebView(messagesToWebView.initialized());
          return element;
        };
        editor = init(document.getElementsByClassName('editor')[0]);
      })(window);
    </script>
  </body>
</html>
`;
