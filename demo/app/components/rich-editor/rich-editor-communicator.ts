import {RichEditorMessage} from './rich-editor-message';
import {BoundMessageHandler} from './bound-message-handler';

interface MessageHandlersStack {
  messageName: string;
  handlers: BoundMessageHandler[];
}

export class RichEditorCommunicator {
  private messageHandlersStacks: MessageHandlersStack[] = [];

  constructor(
    private bridge: {postMessage: (message: string) => void},
    private callbackTimeout: number,
    ...boundHandlers: BoundMessageHandler[]
  ) {
    boundHandlers.map((h) => this.handleIncomingOnce(h));
  }

  public handleIncomingOnce(incomingMessageHandler: BoundMessageHandler) {
    this.ensureStackExists(incomingMessageHandler.messageName).handlers.push(
      incomingMessageHandler,
    );
  }

  public registerIncoming(incomingMessage: RichEditorMessage) {
    const handler = this.ensureStackExists(incomingMessage.name).handlers.pop();
    if (typeof handler !== 'undefined') {
      handler.handler(this, incomingMessage.data);
    }
  }

  public sendout(outcomingMessage: RichEditorMessage) {
    this.bridge.postMessage(JSON.stringify(outcomingMessage));
  }

  public sendoutWithCallback(
    outcomingMessage: RichEditorMessage,
    incomingMessageName: string,
  ): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      let timeout: number = 0;
      const handler: BoundMessageHandler = {
        messageName: incomingMessageName,
        handler: (communicator: RichEditorCommunicator, data?: string) => {
          clearTimeout(timeout);
          resolve(data);
        },
      };
      this.handleIncomingOnce(handler);
      this.sendout(outcomingMessage);
      timeout = setTimeout(() => {
        reject({message: `Message ${outcomingMessage.name} has timed out.`});
      }, this.callbackTimeout);
    });
  }

  private getStack(messageName: string): MessageHandlersStack | undefined {
    const stack = this.messageHandlersStacks.find(
      (s) => s.messageName === messageName,
    );
    return stack;
  }

  private ensureStackExists(messageName: string): MessageHandlersStack {
    const stack = this.getStack(messageName);
    if (typeof stack === 'undefined') {
      const newInstance = {
        messageName: messageName,
        handlers: [],
      };
      this.messageHandlersStacks.push(newInstance);
      return newInstance;
    }
    return stack;
  }
}
