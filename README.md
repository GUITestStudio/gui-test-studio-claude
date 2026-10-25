<p align="center"><img src="icon.png" alt="GUI Test Studio" width="128" height="128"></p>

# GUI Test Studio for Claude

Create, change and run **automated end-to-end tests** of Windows apps and web pages by asking Claude. Describe the
test in a prompt ("open the calculator, compute 12 × 7 and check that it shows 84") and Claude performs the steps on
your real screen with GUI Test Studio's tools, checks every result as it goes, and saves a test you can run again,
from a terminal or a CI/CD pipeline, and open in GUI Test Studio to edit it visually.

- **Create a test from a prompt**: Claude clicks, types, scrolls and drags, then checks texts, values, pictures,
  counts and layouts. A check that could not pass on the screen right now is refused with the reason.
- **Run it** and get a verdict, or open it in GUI Test Runner-Recorder for the full Confidence Report.
- **Change it in place** ("raise the wait to 5 seconds", "rename step 3"): Claude lists the changes and asks before
  anything is written.
- **Web apps on every browser and device**: Chrome, Edge and Firefox, phones, tablets and desktop sizes.
- **From a Figma design**: a test made from a design exported with GUI Test Studio's Figma plugin.

## Requirements

- **Windows 10 or 11.**
- **GUI Test Studio installed**, from [guiteststudio.com/download](https://www.guiteststudio.com/download). Keep
  "Add gtr-cli to the PATH" ticked in the installer: this plugin starts the program `gts-mcp` that GUI Test Studio
  installs there.
- **A GUI Test Studio account** on its free trial or a paid plan, signed in on this computer. Without one, every tool
  answers with how to sign in, and nothing else runs.

Works in **Claude Code** (the terminal and its VS Code and JetBrains extensions) and in **Cowork** sessions that run on
your computer. A local tool like this one does not run in claude.ai chat on the web.

## What this plugin runs, and what is sent

The plugin itself holds no code: it tells Claude to start `gts-mcp`, GUI Test Studio's own program on your computer,
and adds a skill that tells Claude when to use it. Everything the tools do happens in that program:

- **On your computer**: it moves the mouse, types and reads your screen (the windows' accessibility information, the
  page of a browser it opened, the screen's picture) to perform and check the test's steps, and writes the test files
  where you choose.
- **guiteststudio.com**: it checks that you are signed in with a valid trial or plan, whether a newer version of GUI
  Test Studio is published, and, unless you turn them off, sends anonymous usage statistics (for example that a test
  was created from a prompt and through which kind of AI assistant app). Never a test, a screenshot, a prompt or
  anything you type. See the [privacy policy](https://www.guiteststudio.com/privacy); the switch is under Preferences,
  General, Privacy in either application.
- **An AI provider**, only when you turn AI Smart Verification on in GUI Test Studio and choose OpenAI or Anthropic
  with your own key: the two pictures of a visual check that failed, to explain the difference.

Nothing is sent anywhere else.

## Get started

1. Install GUI Test Studio and sign in (the app asks at its first start).
2. Add this plugin. In Claude Code:

   ```
   /plugin marketplace add GUITestStudio/gui-test-studio-claude
   /plugin install gui-test-studio@gui-test-studio
   ```

3. Ask Claude, for example: *"With GUI Test Studio, create an end-to-end test of the Windows
   calculator: compute 12 × 7 and verify the result is 84."*

Documentation: [guiteststudio.com/docs/claude](https://www.guiteststudio.com/docs/claude) ·
Support: [guiteststudio.com/support](https://www.guiteststudio.com/support) · support@guiteststudio.com

## Licence and trademarks

The files of this plugin are released under the MIT licence (see [LICENSE](LICENSE)).
GUI Test Studio itself is proprietary software of GUI Test Studio SARL, used under its own licence agreement
([terms](https://www.guiteststudio.com/terms)). "GUI Test Studio", "GUI Test Runner-Recorder", the GTS logo and the
GTS Vision + AI Engine are trademarks of GUI Test Studio SARL. Claude is a trademark of Anthropic; this plugin is
published by GUI Test Studio and is not made or endorsed by Anthropic.

© 2026 GUI Test Studio SARL. All rights reserved.
