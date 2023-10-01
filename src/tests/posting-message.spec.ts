import {
  PostMessageUseCase,
  PostMessageCommand,
  Message,
  MessageRepository,
  DateProvider,
} from "../post-message.usecase";

describe("Feature: Posting a message", () => {
  describe("Rule: A message can contain a maximum of 280 characters", () => {
    test("Alice can post a message on her timline", () => {
      givenNowIs(new Date("2023-01-19T19:00:00.000Z"));

      whenUserPostMessage({
        id: "message-id",
        text: "Hello World",
        author: "Alice",
      });

      thePostMessageShouldBe({
        id: "message-id",
        text: "Hello World",
        author: "Alice",
        publishedAt: new Date("2023-01-19T19:00:00.000Z"),
      });
    });
  });
});

let message: Message;

function givenNowIs(_now: Date) {
  dateProvider.now = _now;
}

class InMemoryMessageRepository implements MessageRepository {
  save(msg: Message): void {
    message = msg;
  }
}

class StubDateProvider implements DateProvider {
  now: Date;
  getNow(): Date {
    return this.now;
  }
}

const messageRepository = new InMemoryMessageRepository();
const dateProvider = new StubDateProvider();

const postMessageUseCase = new PostMessageUseCase(messageRepository, dateProvider);

function whenUserPostMessage(postMessageCommand: PostMessageCommand) {
  postMessageUseCase.handle(postMessageCommand);
}

function thePostMessageShouldBe(expectedMessage: Message) {
  expect(expectedMessage).toEqual(message);
}
