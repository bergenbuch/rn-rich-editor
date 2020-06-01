import {RichEditorCommunicator} from './rich-editor-communicator';

export interface BoundMessageHandler {
  messageName: string;
  handler: (communicator: RichEditorCommunicator, data?: string) => void;
}
