export interface RichEditorApi {
  getHtml(): Promise<string>;
  setHtml: (html: string) => void;
  bold: () => void;
  italic: () => void;
  underline: () => void;
}
export interface RichEditorProps {
  initialHtml: string;
  initialPlaceholder?: string;
  onInitialized: (api: RichEditorApi) => void;
}
