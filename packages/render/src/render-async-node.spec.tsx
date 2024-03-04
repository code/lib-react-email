/**
 * @vitest-environment node
 */

import { Template } from "./utils/template";
import { Preview } from "./utils/preview";
import { renderAsync } from "./render-async";

describe("render on node environments", () => {
  it("converts a React component into HTML with Next 14 error stubs", async () => {
    vi.mock("react-dom/server", async () => {
      const ReactDOMServer =
        await vi.importActual<typeof import("react-dom/server")>(
          "react-dom/server",
        );
      const ERROR_MESSAGE =
        "Internal Error: do not use legacy react-dom/server APIs. If you encountered this error, please open an issue on the Next.js repo.";

      return {
        ...ReactDOMServer,
        renderToString() {
          throw new Error(ERROR_MESSAGE);
        },
        renderToStaticMarkup() {
          throw new Error(ERROR_MESSAGE);
        },
      };
    });

    const actualOutput = await renderAsync(<Template firstName="Jim" />);

    expect(actualOutput).toMatchInlineSnapshot(
      '"<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><h1>Welcome, <!-- -->Jim<!-- -->!</h1><img alt="test" src="img/test.png"/><p>Thanks for trying our product. We&#x27;re thrilled to have you on board!</p>"',
    );

    vi.resetAllMocks();
  });

  it("converts a React component into HTML", async () => {
    const actualOutput = await renderAsync(<Template firstName="Jim" />);

    expect(actualOutput).toMatchInlineSnapshot(
      '"<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><h1>Welcome, <!-- -->Jim<!-- -->!</h1><img alt="test" src="img/test.png"/><p>Thanks for trying our product. We&#x27;re thrilled to have you on board!</p>"',
    );
  });

  it("converts a React component into PlainText", async () => {
    const actualOutput = await renderAsync(<Template firstName="Jim" />, {
      plainText: true,
    });

    expect(actualOutput).toMatchInlineSnapshot(`
      "WELCOME, JIM!

      Thanks for trying our product. We're thrilled to have you on board!"
    `);
  });

  it("converts to plain text and removes reserved ID", async () => {
    const actualOutput = await renderAsync(<Preview />, {
      plainText: true,
    });

    expect(actualOutput).toMatchInlineSnapshot(
      `"THIS SHOULD BE RENDERED IN PLAIN TEXT"`,
    );
  });
});
