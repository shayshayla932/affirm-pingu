# Design QA — User center and settings layout

- Source visual truth: `/var/folders/63/d409phln5j71lfx7y4mwg72c0000gn/T/codex-clipboard-49e77e92-2490-439e-8024-99605b5628a9.png`
- Intended viewport: 390 × 844 CSS px
- State: personal center with settings expanded inline

## Implemented comparison targets

- Personal center: visible centered circular avatar, overlaid edit control, grouped profile/account menu, and all settings modules expanded inline below it.
- The redundant Settings row is hidden, so users no longer enter a second page before reaching individual settings.
- Existing app-specific copy, controls, uploads, language selection, privacy content, and navigation behavior remain intact.

## Static checks

- JavaScript syntax check passed, including the inline settings relocation and save-on-close path.
- CSS and repository whitespace checks passed.
- Cache versions were advanced to `v98`.

## Blocker

The in-app browser's existing local preview stopped serving styles and subsequently refused the local preview connection, so a valid browser-rendered implementation screenshot could not be captured. The source image was opened successfully, but the required same-viewport visual comparison and interaction verification could not be completed.

## Required fidelity surfaces

- Fonts and typography: implemented with the app's existing type system and source-like centered title hierarchy; browser comparison pending.
- Spacing and layout rhythm: implemented from the reference's dark-header/white-sheet proportions; browser comparison pending.
- Colors and visual tokens: existing `--page-blush`, `--frost-panel-bg`, `--frost-panel-border`, `--ink`, and `--ink-soft` tokens are used throughout; the reference's black/gray palette is intentionally not copied.
- Image quality and assets: existing user-uploaded avatar is reused; no replacement asset is needed.
- Copy and content: all existing product-specific content is preserved.

final result: blocked
