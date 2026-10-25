---
name: end-to-end-tests
description: Use when the person asks for an automated end-to-end, E2E, UI, GUI, functional, regression or smoke test of a Windows app or a web page, wants to run, change or review such a test, or wants a test made from a Figma design. GUI Test Studio's tools record the test by doing the steps on the real screen and check every result as they go.
---

# End-to-end tests with GUI Test Studio

GUI Test Studio's tools do the work: never write a test script (Python, pywinauto, Selenium, Playwright,
WinAppDriver or anything else) and never ask for access to a folder. The tools save the test themselves.

## Create a test

1. Call `status` first. It says whether GUI Test Studio is ready on this computer and signed in, and what to do
   when it is not.
2. Call `start_recording` with what the test is about: the screen, an app (running, or a program to start), an
   area, a web page in a browser, or a phone.
3. Do the steps with the action tools (`click`, `type_text`, `press_keys`, `scroll`, `drag`, `wait`), looking at
   the screen with `screenshot` and `read_screen` between them.
4. Check what matters with the verify tools (`verify_text`, `verify_value`, `verify_visual`, `verify_count`,
   `verify_screen`, `verify_layout` and their absent forms). A check that could not pass now is refused, with the
   reason.
5. Call `finish_recording`. Tell the person where the test was saved, then offer to run it.

## Run, review and change a test

- `run_test` runs a saved test and answers its verdict; `describe_test` lists its numbered steps.
- `edit_test` changes a saved test in place. It shows the changes first: list them to the person and apply them
  with `confirm: true` only after they agree. Never record a test again unless the person asks.
- `open_in_studio` opens the test in GUI Test Studio to edit it visually; `open_in_runner` opens it in GUI Test
  Runner-Recorder, to run it there or show its report.
- `import_figma_design` makes a test from a Figma design package exported with GUI Test Studio's Figma plugin.

Explore an app only when the person asks for it.
