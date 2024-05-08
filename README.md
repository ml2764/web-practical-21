# Practical 21 (W11 P1): Modules and Assessment 2
Stage 1 covers ES6 modules, beginning with a simple exercise to get you used to the new syntax and structure. Stage 1 also encourages you to think about how you might use modules in your assessment 2. Stage 2 will give you a sense of how your assessment 2 will be marked using a sample submission (just the application, not the report).

## Stage 1 - ES6 Modules
### Exercise 1.1 - Using ES6 modules
In the stage 1 folder, you will find a variation of the room management system shown in class. This application is lacking some feedback for the user but it is functional! 

Notice that the scripts folder contains A LOT of different JavaScript files. Open up each HTML file and take a look at the scripts that it links using the traditional approach. Take a moment to familiarise yourself with what the application does and what is in each file.

Your task is convert this application from the traditional method of using multiple script files to the more modern ES6 module approach. Here are the basic steps:

1. In each HTML file, remove all `<script>` tags except the last one. The last script imported is the entry point--the file that runs code specific to the current page when the page is loaded.
2. In the remaining `<script>` tag in each HTML file, add the attribute `type="module"`.
3. Now for the tricky part... In each JavaScript file, export the fields (functions, classes etc) that are used by other files and add import statements to import any functionality needed from other files.

Hint: You can use the browser console to help with step 3. When you run the HTML file, you will probably see error messages, which you can use to figure out what needs to be exported and what needs to be imported. If something is "not defined", figure out what file it is in, export it, then import it into the file that has the error message.

### Exercise 1.2 - Using multiple JS files in your assessment
If you're not already using multiple JS files in your assessment, consider if it might be wise. If you have one big long JavaScript file that contains a mix of code only relevant to specific HTML files, and code that is used across multiple HTML files, then you should probably split the file up into separate JavaScript files. As a general rule, you should put code only used by one HTML file in a separate JS file. If you have JavaScript code used by multiple HTML files, put it in a common JS file that you can reuse across each HTML file that needs it.

If you DO have multiple JS files already, consider using the ES6 module approach rather than the traditional approach of linking multiple scripts in the HTML. There is nothing inherently wrong with the traditional approach but modules are closer to the way most web frameworks work, which is fast becoming the industry standard.

If you haven't got far enought to have much JavaScript, that's OK! Take time to plan out how you might make use of the module approach to keep your code well organised.

## Stage 2 - Assessment 2 marking
In the sample code from lecture, there is an example submission for assessment 2 (web application only), called time-keeper. It is also included in this repo for convenience. Your job is to review the application against the marking criteria and the requirements listed in the brief. Follow the same steps that will be used when marking your assessment 2 submission (see below).

Tip: do NOT assume that the time-keeper is an example of a 1st class project, just because it's being given to you as a sample! (Spoiler alert: it has quite a few problems even though some of the JS is more advanced)

Start by checking that the basic technical requirements have been met. Open the time-keeper app in VS Code and make the following checks by looking at the code:
1.	Check the number of HTML pages. Does it meet the requirements?
2.	Use the W3C validator to check each HTML page. Note down any issues.
3.	Check that the application uses HTML, a substantial amount of custom CSS, and a substantial amount of custom JS (all three) and no other languages. Custom means that it has been written for the application rather than directly pulled from a library or tutorial without customisation.
4.	Are any web APIs used? If so:
    - Is it open (no authentication required)?
    - Is placeholder data provided in case of an error fetching data?
5.	Check if any JS libraries are used. If so:
    - Is the library on the list of permitted libraries?
    - Is the library used via a `<script>` element in the HTML? If the script `src` attribute points to a local file, is that file present in the submission?
6.	Check that at least some form of data storage covered in this module (`localStorage`, `sessionStorage`, or `indexeddb`) is used somewhere in the application.

Using Live Preview, run index.html in Chrome. The focus of the next set of steps is the user experience:
1.	Run the Chrome Lighthouse accessibility audit on each HTML page. Note the score and, if there are failing tests, note the requirement that was missed. Some applications will be inherently inaccessible (e.g. canvas-based games) so context matters. 
2.	Set the window size to 1280px by 800px. You can do this using device mode in Chrome Developer tools.
3.	Open the Console tab and keep an eye out for errors. Errors related to Chrome Dev Tools themselves or a missing favicon can be ignored.
4.	Consider the user experience from the perspective of a first-time visitor to the application. Can you work out the purpose of the application? Does the application guide you in how to interact with it? Interact with each page and try every feature that you find. Get to the point that data is collected from the user and assess how that is done. Check if stored data is reflected back to the user (as appropriate for the application). Note: with a full submission that includes the report, if anything is unclear, we would refer to the report for clarification.
5.	Where data collection is performed (e.g. contact form), does it meet usability heuristics e.g. constraints, feedback? Try giving obviously invalid responses or leaving fields blank as appropriate.
6.	Close the application then re-run it using Live Preview. How is saved data used?
7.	Is the overall experience “rich”? How complete is the user experience? Does the app provide multiple features or, in the case of a game, how complete is the game play?
8. If the application is a clone of an existing game, does it provide anything new? Clones that mimic the functionality of an existing game but don't provide anything new tend to score lower for user experience as they are using someone else's user experience design!

Finally, return to VS code to consider the technical complexity and the code quality. When considering code complexity, do not give credit for code copied directly from external sources. 
1.	Does the HTML follow best practice?
2.	Are custom CSS rules used in a way that avoids lots of repetition?
3.	Are custom CSS classes and ids meaningfully named?
4.	Are JS variables and functions meaningfully named?
5.	Are ES6 variable declarations used (let and const rather than var)?
6.	Is the JS code documented where needed?
7.	Does the JS use data structures appropriately?
8.	How complex is the JS code? This is subjective. Look for JS topics introduced in lecture: DOM manipulation, input validation, event listeners etc. Look for evidence that JS documentation has been used to go beyond specific syntax covered in lecture. This is not a requirement, but more advanced JS can open up the highest possible marks for technical implementation (e.g. 80+) as long as basic requirements are met

Important note for the real marking process: Where weakness or limitations are identified while following the steps above, the report will be consulted for explanation or further context, which may impact the final score for each application criteria. For example, if the user experience is confusing, we will read the report to get a sense of the intended experience then return to application with that experience in mind. In a case like this, the initial user experience issues will affect the mark given but, the context in the report may lessen the negative impact on the mark. 
