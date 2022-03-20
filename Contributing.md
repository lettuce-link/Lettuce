# Contributing

Thanks for your interest in contributing to Lettuce!

Rather than creating something independently, please pick an existing issue labeled with "good first issue" or "contributions welcome".

## Code guidelines

To keep the codebase maintainable, please try to follow these guidelines:

Write short, well-structured functions.

Make things reusable (e.g. put as much business logic in hooks as possible).

Make everything as self-descriptive as possible (using good names and types), document every public function that is not sufficiently self-descriptive. We don't really have typescript everywhere (it can get verbose), but annotating commonly-used functions will make development easier because of better autocomplete.

Keep user experience and accessibility in mind.

## Styling

Lettuce uses [styled-jsx](https://github.com/vercel/styled-jsx) for styling.

Please try to keep things minimal and consistent, reuse the same building blocks when possible.

Use powers of 2px for all sizes and dimensions (2, 4, 8, 16..). This dumb trick makes a lot of things magically lign up.

Use variables for everything else (e.g. `var(--background-strong)`).
