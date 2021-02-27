# Hiring Test

## Summary

Create an app that loads and displays carbon intensity data from National Grid ESO's carbon intensity API. Please read the full the description before beginning.

## Detailed Requirements

Broken down into Required - General, Required - Functionality, Bonus, and Allowances

### Required - General

* Use React. We have given you a basic app boilerplate to get started.
* Use CSS (or a preprocessor if you want to get fancy).
* Add some design flair.
* Attempt at least 1 item from both bonus categories (and explain your choices).
* Use best practices for source code management (commit granularity, commit message strategy, etc.).

### Required - Functionality

#### Home (Overview) Page
* Display today's overall carbon intensity.
* Display today's carbon intensity by region (ex. as a table).
* User should be able to sort regions by carbon intensity.
* Clicking on a region should open highlights of that region in a side panel.
* Side panel should display region's carbon intensity from the past week and past month.
* Side panel should have a "Go to Region" link/button that takes the user to a region details page.

#### Region (Details) Page
* User should be able to select any time range.
* User should be able to switch to a different region.
* Display the overall carbon intensity for the selected time range.
* Display the carbon intensity for each day within the time range.

### Bonus

#### Functionality
* Use interactive graphics (ex. charts) to show data on the region page.
* Incorporate relevant data in addition to carbon intensity, either from the National Grid API or another public API.
* Make app responsive (for different screen sizes).
* Add web accessibility.
* Add localization.

#### Other
* Use TypeScript.
* Include unit tests.
* Implement a code linter and configure which rules to use (perhaps select some of your favorite and/or most-used rules?).

### Allowances

You may use any standard/common NPM libraries, keeping in mind that we are trying to assess you and not the library creators.

## API Docs

https://carbon-intensity.github.io/api-definitions/#carbon-intensity-api-v2-0-0

## Grading

* Functionality.
* Clarity and organization of code.
* Mastery of React.
* Handling of data and application state (Ex. Redux?).
* User interface and creativity of design.

## Delivery

Choose your own adventure:
* Share via Google Drive link or something similar.
* Upload to a *private* repo and share it with us.

*Make sure to preserve git history*

## Just for Kicks

Host the running app somewhere. This is certainly not a requirement, so we will leave this up to you ;)
