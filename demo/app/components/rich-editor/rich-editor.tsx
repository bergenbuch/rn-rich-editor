import React, {useState} from 'react';
import {StyleSheet} from 'react-native';
import {WebView} from 'react-native-webview';
import {RichEditorProps} from './rich-editor.props';
import {RichtEditorHtml} from './rich-editor-html';
import {RichEditorCommunicator} from './rich-editor-communicator';
import {RichEditorBridge} from './rich-editor-bridge';
import {RichEditorMessage} from './rich-editor-message';
import {BoundMessageHandler} from './bound-message-handler';
import {RichEditorMessages} from './rich-editor-messages';
import {RichEditorApiFactory} from './rich-editor-api-factory';

const BoundMessengerTimeout: number = 2000;

export const RichEditor: React.FunctionComponent<RichEditorProps> = (props) => {
  const [bridge, setBridge] = useState<WebView | null>(null);
  const [richEditorCommunicator, setRichEditorCommunicator] = useState<
    RichEditorCommunicator | undefined
  >();

  const initializedHandler: BoundMessageHandler = {
    messageName: RichEditorMessages.incoming.initialized,
    handler: (communicator: RichEditorCommunicator) => {
      if (typeof communicator !== 'undefined') {
        communicator.sendout({
          name: RichEditorMessages.outgoing.setHtml,
          data: props.initialHtml,
        });

        if (typeof props.initialPlaceholder === 'string') {
          communicator.sendout({
            name: RichEditorMessages.outgoing.setPlaceholder,
            data: props.initialPlaceholder,
          });
        }

        props.onInitialized(new RichEditorApiFactory(communicator).create());
      }
    },
  };

  const refCalled = (r: any | null) => {
    const changed = r !== bridge;
    setBridge(r);
    if (changed && r !== null) {
      const castedBridge: RichEditorBridge = r;
      setRichEditorCommunicator(
        new RichEditorCommunicator(
          castedBridge,
          BoundMessengerTimeout,
          initializedHandler,
        ),
      );
    }
  };

  return (
    <WebView
      style={styles.webview}
      originWhitelist={['*']}
      ref={(r) => {
        refCalled(r);
      }}
      onMessage={(event) => {
        const message: RichEditorMessage = JSON.parse(event.nativeEvent.data);
        if (richEditorCommunicator) {
          richEditorCommunicator.registerIncoming(message);
        }
      }}
      source={{html: RichtEditorHtml}}
    />
  );
};

const styles = {
  ...StyleSheet.create({
    webview: {
      flex: 1,
    },
  }),
};
