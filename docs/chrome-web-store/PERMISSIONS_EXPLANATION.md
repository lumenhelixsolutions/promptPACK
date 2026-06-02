# Permissions Explanation

promptPACK is designed to be local-first and user-triggered.

## `sidePanel`

Used to display the promptPACK side-panel interface.

## `activeTab`

Used only after user action so promptPACK can interact with the current active tab.

## `scripting`

Used for Chrome extension mechanics related to active tab interaction.

## Content script

The content script supports:

- reading selected text after the user clicks "Use selected text"
- inserting generated output after the user clicks "Insert into active field"

## Host permissions

The current manifest uses no broad host permissions.

## Safety boundary

promptPACK does not:

- scrape pages automatically
- send data to a server
- use remote code
- auto-insert text
- auto-send prompts
- auto-publish content
