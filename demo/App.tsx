import React, {useState} from 'react';
import {
  SafeAreaView,
  View,
  StatusBar,
  Button,
  Text,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {RichEditor} from './app/components/rich-editor/rich-editor';
import {RichEditorApi} from './app/components/rich-editor/rich-editor.props';

const App = () => {
  const initialHtml = '<b>Formatted Text</b> Initial Value';
  const initialPlaceholder = 'Type here...';
  const [richEditorApi, setRichEditorApi] = useState<RichEditorApi>();
  const setDate = () => {
    if (typeof richEditorApi !== 'undefined') {
      richEditorApi.setHtml(
        `<i>Current date:</i> <b>${new Date().toISOString()}</b>`,
      );
    }
  };
  const readHtml = async () => {
    if (typeof richEditorApi !== 'undefined') {
      const html = await richEditorApi.getHtml();
      Alert.alert(html);
    }
  };
  const bold = () => {
    if (typeof richEditorApi !== 'undefined') {
      richEditorApi.bold();
    }
  };
  const italic = () => {
    if (typeof richEditorApi !== 'undefined') {
      richEditorApi.italic();
    }
  };
  const underline = () => {
    if (typeof richEditorApi !== 'undefined') {
      richEditorApi.underline();
    }
  };
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.container}>
        <View style={styles.container}>
          <RichEditor
            initialHtml={initialHtml}
            initialPlaceholder={initialPlaceholder}
            onInitialized={(api) => {
              setRichEditorApi(api);
            }}></RichEditor>
          <View style={styles.row}>
            <TouchableOpacity onPress={() => bold()}>
              <Text style={styles.bold}>Bold</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => italic()}>
              <Text style={styles.italic}>Italic</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => underline()}>
              <Text style={styles.underline}>Underline</Text>
            </TouchableOpacity>
          </View>
          <Button title="SET DATE" onPress={setDate}></Button>
          <Button title="READ HTML" onPress={readHtml}></Button>
        </View>
      </SafeAreaView>
    </>
  );
};
export default App;

const styles = {
  ...StyleSheet.create({
    container: {flex: 1},
    row: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingBottom: 36,
    },
    bold: {fontWeight: 'bold'},
    italic: {fontStyle: 'italic'},
    underline: {textDecorationLine: 'underline'},
  }),
};
