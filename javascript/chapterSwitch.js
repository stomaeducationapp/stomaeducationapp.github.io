/* AUTHOR INFORMATION
 * CREATOR - Jeremy Dunnet 06/09/2018
 * LAST MODIFIED BY - Jeremy Dunnet 26/09/2018 
 */

/* CLASS/FILE DESCRIPTION
 * This is the javascript file for building, handling and displaying the chapter text and subchapters
 * Each chapter has its text imported from a database - allowing the page to dynamically update the page with new chapters (no page changes needed)
 * The code is the same - since we will use unique event listeners to import the chapter number and subchapter number to easily retrieve the corrseponding chapter text
 */

/* VERSION HISTORY
 * 06/09/2018 - Created file and set placeholder functions
 * 07/09/2018 - Edited placeholder functions to use a draft version of final functionality
 * 09/09/2018 - Finalised draft functionailty for chapter content display - and added bookmark functionality to it
 * 13/09/2018 - Updated textArea ID so it works with new headers.html divs, added ability to clear all bookmarks and moved some HTML Sections other project memeber Case Rogers designed so they can be easily switched like chapters
 * 15/09/2018 - Reworked some buttons/added new buttons to faciliate chapter quiz integration, reworked all HTML strings into multiline to allow for easier editiability
 *              and edited variable names to match shared space (with other js files) in headers.html
 * 19/09/2015 - Edited help page image paths so they load properly - and fixed busg related to quiz buttons and chapter tab selection
 * 22/09/2018 - Fixed a few bugs and altered click listener for chapter splash screens
 * 26/09/2018 - Updated to use new fucntions related to popups
 */

/* REFERENCES
 * The function loadChapterJSON and it's impact on the code was learned/adpated from https://codepen.io/KryptoniteDove/post/load-json-file-locally-using-pure-javascript
 * Javascript exception handling learned/adapted from https://stackoverflow.com/questions/4467044/proper-way-to-catch-exception-from-json-parse
 * Creating button listeners with imports adapted from https://stackoverflow.com/questions/9643311/pass-string-parameter-in-an-onclick-function
 * Scroll up fucntionality was learned/adapted from https://stackoverflow.com/questions/19311301/how-to-scroll-back-to-the-top-of-page-on-button-click
 * How to get just text out of a HTML element learned/adapted from https://stackoverflow.com/questions/19030742/difference-between-innertext-and-innerhtml
 * How to use localStorage learned/adpated from https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
 * Javascript 2D array syntax learned from https://stackoverflow.com/questions/966225/how-can-i-create-a-two-dimensional-array-in-javascript
 * How to scroll to a particular element learned from https://www.w3schools.com/jsref/met_element_scrollintoview.asp
 * And many tutorials/documentation from https://www.w3schools.com 
 */


//A const name for the corresponding JSON file we will use to simulate a request to a database
/* AUTHOR INFORMATION
 * CREATOR - Jeremy Dunnet 06/06/2018
 * LAST MODIFIED BY - Jeremy Dunnet 19/09/2018
 * 
 * CLASS/FILE DESCRIPTION
 * The JSON acts as a mock database - which can be filled with arrays pertaining to the pool of text available for that chapter
 * Each array has a unique name which is used to only get subchapters related to the specific chapter
 * The JSON file is also parsed directly into a javascript object so it can be used easily
 * Sections per chapter (currently)
 * - Chapter 1 (Pop Culture, Trick Questions, Medicine, Obviousness and Myth)
 * - Chapter 2 (Trick Questions, Animals, Astrology, Time and History)
 * 
 * VERSION HISTORY
 * 06/09/2018 - Created the first version of chapters and subchapters
 * 07/09/2018 - Fixed some typos and added the splash screen for each chapter
 * 09/09/2018 - Fixed some more typos
 * 17/09/2018 - Added some placeholders for Media Playback integration
 * 19/09/2018 - Added full media tags
 * 
 * REFERENCES
 * All tutorials on setup and design of simple JSON files was adapted/learned from https://www.w3schools.com
 * How to encode html tags into JSON learned from https://www.thorntech.com/2012/07/4-things-you-must-do-when-putting-html-in-json/
 * 
 */
const chapterJSONFile = "/json/chapters.json";

//A html body for the error screens
const headersBugScreen =
`<p>Looks like an error has occured.<br />
 To try and fix the issue:
 <ul>
    <li>Refresh the page</li>
    <li>Close the window and reload</li>
    <li>Try from a different browser - supported browsers include:
        <ul>
            <li>Chrome (Version 68 and above)</li>
            <li>Edge (Version 17 and above)</li>
            <li>Opera (Version 55 and above)</li>
        </ul>
    </li>
 </ul>
 </p>`;
//Modification to screen to add a additonal solution to fix if chapters loaded bad
const chapterBugScreen =
`<p>Looks like an error has occured.<br />
 To try and fix the issue:
 <ul>
    <li>Try and load another chapter section and then retry</li>
    <li>Refresh the page</li>
    <li>Close the window and reload</li>
    <li>Try from a different browser - supported browsers include:
        <ul>
            <li>Chrome (Version 68 and above)</li>
            <li>Edge (Version 17 and above)</li>
            <li>Opera (Version 55 and above)</li>
        </ul>
    </li>
 </ul>
 </p>`;

//Variables for storing all the data related to chapters (names, amount of sctions.chapters) for use in bookmarking
//Allows for simple edits up here

//Object reference for storing data related to bookmarks during runtime (used to track what bookmarks are active)
function bookmark(name, text, marker)
{
    this.pageName = name; //Store the name for local storage key
    this.pageText = text; //Store original text so that when we edit the bookamrk we can overwite it
    this.symbol = marker; //Store the current symbol we have as a bookmark
}

//Constant for the max number of sections a chapter has - used to prevent navigating to an unknown section
const maxChapters = 2;
//Constant for the max number of sections a chapter has
const maxSections = 6;
//Constant array of all ids of chapters - to use as pageName variables
const chapterIDs = [
    ["chapterOne", "scPop", "scTrickOne", "scMed", "scObv", "scMyth", "cqOne"],
    ["chapterTwo", "scTrickTwo", "scAnimal", "scAstro", "scTime", "scHist", "cqTwo"]
];
//Constants for all bookmark symbols (added space to give space to original text)
const unfinishedMark = " …";
const finishedMark = " ✔";
const importantMark = " !";
const rereadMark = " ⋆";
//Array to store all bookmark objects
var chapterMarks = new Array(maxChapters);
for (ii = 0; ii < maxChapters; ii++) //Set each chapter to hold a number of bookmark objects equal to maxSections
{
    chapterMarks[ii] = new Array((maxSections + 1)); //We add one since each chapter has a "start page"
}

//Global for the current chapter in memory - acts as a cache so user can quickly move through subchapters
//If they want to bounce around they need to wait to reload from the database
var chapterText = new Array((maxChapters + 1));
//This is used to check if we have already loaded this chapter - allow for faster loading
var loaded;

//These are the HTML text for the buttons to navigate through the chapter
//The first section does not have a back button enabled - as of the current design a user can walk a whole chapter backwards and forwards but
//not move from chapter to chapter, though this can be easily changed - same reasoning for finalSectionButt
//The reason we have them included but disabled is to keep the button placement on the screen consistent (CSS Layout)
//They have weird placement of some >< so that the divs smash together on the screen
//<div>Icons made by <a href="https://www.flaticon.com/authors/roundicons" title="Roundicons">Roundicons</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div>
const startSectionButt =
`<div id="chapterNav" align="left" style="padding-left: 17px">
    <img id="backButt" src="/media/NavigationArrows/left-arrow.png" disabled/>
    <img id="nextButt" src="/media/NavigationArrows/right-arrow.png" title="Click here to go the first chapter"/>
 </div>`; 
const normalSectionButt =
`<div id="chapterNav" align="center">
    <img id="backButt" src="/media/NavigationArrows/left-arrow.png" title="Click here to go to previous chapter"/>
    <img id="nextButt" src="/media/NavigationArrows/right-arrow.png" title="Click here to go to the next chapter"/>
 </div>`;
const finalSectionButt =
`<div id="chapterNav" align="center">
    <img id="backButt" src="/media/NavigationArrows/left-arrow.png" title="click here to go back to the previous chapter"/>
    <button class="chapterButton" id="nextButt">Quiz</button>
 </div>`;

//HTML container for the mark as reread and important bookmark options
//AT THE MOMENT THE WORDING IS THE ONLY THING KEEPING THIS AND THE ABOVE SECTIONS AS ALIGNED IN THE CENTER AS I CAN! - EDIT AT YOUR OWN PERIL!!!!!!!!
//If you can style it better please try
//They have weird placement of some >< so that the divs smash together on the screen
//<div>Icons made by <a href="http://www.freepik.com" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div>
//<div>Icons made by <a href="https://www.flaticon.com/authors/elegant-themes" title="Elegant Themes">Elegant Themes</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div>
const additonalBookmarks =
`<div id="markers" align="center">
    <img id="rereadButt" src="/media/BookmarkIcons/open-book.png" title="Click here to mark 'read again' If you need to read again"/>
    <img id="importantButt" src="/media/BookmarkIcons/exclamation-button.png" title="Click here to mark 'important!' If you need to refer back"/>

 </div>`;

//This is for the first page of the chapter since the allignment is to the left
const additonalBookmarks_2 =
    `<div id="markers" align="left">
    <img id="rereadButt" src="/media/BookmarkIcons/open-book.png" title="Click here to mark 'read again' If you need to read again"/>
    <img id="importantButt" src="/media/BookmarkIcons/exclamation-button.png" title="Click here to mark 'important!' If you need to refer back"/>

 </div>`;


//HTML Containers for top navigation bar sections and corresponding button objects - These are constant so we define here so we can reload when page changes to chapter content
const homePage = 
    `<h1>This is the Main Screen</h1>
     <p>Select a content header to get started!</p>`;
const newsPage =
    `<h1>This is the News page</h1>
     <p>Here you can find:
        <ul>
        <li>Important announcements</li>
        <li>Website changes</li>
        <li>News concerning the subject matter</li>
        </ul>
     </p>`;
const tutorialPage =
    `<div id="tutorial-layout"
<br>
    <h1>Tutorial</h1>
    <a class="link" href="#video">1. Skip to Play Video tutorial</a>
    </br></br>
    <a class="link" href="#mark">2. Skip to Content Marking tutorial</a>
    </br></br>
    <a class="link" href="#search">3. Skip to Search tutorial</a>
    </br></br>
    <!--Play video tutorial info-->
    <h2 id="video">Play A Video:</h2>
        <p>First, browse for a particular piece of content in the sidebar.</p>
        <img src="./media/images/Main Screen.PNG" alt="Sidebar image" class="images" width=70% />
        <p>When you have found something you wish to view, select it.</p>
        <img src="./media/images/MainScreen2(content).PNG" alt="Video select image" class="images" width=70%/>
        <p>Proceed to interact with the controls to play, pause and navigate the video.Options to change volume and to move into full screen view are also available.</p>
        <img src="./media/images/PlayVideo(content).PNG" alt="Video player image" class="images" width=70%/>
        </br>
        <a href="#top">Return to top</a>
    <!--Mark content tutorial info-->
    <h2 id="mark" style="padding-top: 50px">Mark Content:</h2>
        <p>At the bottom of every chapter you will see these symbols.</p>
        <img src="./media/images/Bookmarking.PNG" alt="Video select image" class="images" width=70%/>
        <p>Click the book to mark the chapter to be "re-read" for later.</p>
        <img src="./media/images/ReRead(content).PNG" alt="Video select image" class="images" width=70%/>
        <p>A star will appear next to the chapter which is to be re-read.</p>
        <img src="./media/images/ReRead2.PNG" alt="Unmarked content image" class="images" width=70%/>
        <p>Click the exclamation to mark the chapter as "Important".</p>
        <img src="./media/images/MarkImportant(content).PNG" alt="Video select image" class="images" width=70%/>
        <p>An exclamation mark will appear next to the chapter.</p>
        <img src="./media/images/MarkImportant.PNG" alt="Unmarked content image" class="images" width=70%/>
        </br>
        <a href="#top">Return to top</a>
    <!--Searching tutorial info-->
    <h2 id="search" style="padding-top: 50px">Search:</h2>
        <p>From the start page, notice the search bar.</p>
        <img src="./media/images/SearchBar.PNG" alt="Searchbar image" class="images" width=70%/>
        <p>Start typing something to search for and possible matches will appear.</p>
        <img src="./media/images/Search.PNG" alt="Searching image" class="images" width=70% />
        <p>Select the content that you wish to view and it will be loaded into the page.</p>
        <p>Here we have selected the Trick Questions page to be viewed.</p>
        <img src="./media/images/SearchClick.PNG" alt="Search complete image" class="images"width=70% />
        </br>
        <a href="#top">Return to top</a>
</div>`;
const contactsPage =
    `<h1>Contacts</h1>
    <h2>XYZ Hospital</h2>
        <p>Address: 123 ABC Street, Perth, WA</p>
        <p>Phone: (08) 1111 1111</p>
        <p>E-mail: XYZ@hospital.com</p>
        <p>Fax: (08) 2222 2222</p>
    <h2 style="padding-top: 30px">XYZ Emergency Room</h2>
        <p>Address: 456 ABC Street, Perth, WA</p>
        <p>Phone: (08) 3333 3333</p>
    <h2 style="padding-top: 30px">Social Media</h2>
        <p>Facebook: 
            <a href="www.facebook.com/XYZ">www.facebook.com/XYZ </a>
        </p>
        <p>Twitter: 
        <a href="www.twitter.com/XYZ">@XYZ_Hospital</a>
        </p>`;
const faqPage =
`<h1>Frequently Asked Questions</h1>
    <h3>What is an ileostomy stoma?</h3>
        <p>An ileostomy stoma is an opening created between the small intestine and the abdominal wall for the evacuation of faeces when organ function is abnormal.</p>
    <h3>Is a stoma surgery permanent?</h3>
        <p>A stoma surgery may be permanent or temporary depending on the reason. You should be able to get information about yourcondition from your stoma therapy nurse.</p>
    <h3>What do I do if I am having problems with my stoma?</h3>
        <p>You should contact your stoma therapy nurse or general practitioner, or in case of emergencies your hospital’s emergency room.</p>
    <h3>How is waste collected?</h3>
        <p>Evacuated waste is collected in a bag connected to the stoma via an adhesive.</p>
    <h3>Where can I get stoma bags from?</h3>
        <p>Your stoma therapy nurse will assist you in finding the best location to acquire any appliances you require to maintain your health.It is always best to check with your nurse before purchasing/using new products to confirm it is what you need.</p>
    <h3>How do I dispose of a used bag?</h3>
        <p>If possible empty the contents into the toilet. Secure the appliance in a plastic bag and dispose in a regular rubbish bin.</p>
    <h3>Should I tell people about my stoma?</h3>
        <p>Whether or not you inform others about your stoma is completely up to you. Either way it is important to remember that you shouldnot be ashamed of your stoma surgery.</p>
    <h3>Can I travel with a stoma?</h3>
        <p>The presence of a stoma should not stop you from travelling, however it is recommended to always take a reasonable supply of stomabags with you, as availability can be uncertain.</p>
        </br>
    <h3>Couldn&#39t find what you were looking for?</h3>
        <p>Any further questions should be directed towards your registered stoma therapy nurse.</p>
        </br>
        <p>FAQ adapted from:
        <a href="https://australianstoma.com.au/about-stoma/frequently-asked-questions/">australianstoma.com</a>
        </p>`;

const homeButt = document.getElementById("homeButt");
const newButt = document.getElementById("newsButt");
const tutorialButt = document.getElementById("tutorialButt");
const faqButt = document.getElementById("faqButt");
const contactsButt = document.getElementById("contactsButt");
const clearBookButt = document.getElementById("clearBookButt"); //Deals with clearing all bookmarks

//HTML for Chapter quiz layout
const quizLayout = 
`<div id="quiz"></div>
 <div id="chapterNav">
    <button class="quizButton" id="returnButt">Back to start of chapter</button>
    <button class="quizButton" id="continueButt" disabled>Continue to next chapter</button>
 </div>`;

//Main div where all chapter text is displayed - we use it constantly to inject into when chapters change
const textArea = document.getElementById("home");
//Special navigation button variables (These are initalized dynamically so they have no value now) - these are reused in every chapter so
//they are not grouped in the button section below
var backButt;
var nextButt;
//For bookmarking specifically
var rereadButt;
var importantButt;
var clearButt //Specific button to clear all bookamrks currently in localStorage - we set when we inject the settings page

//Buttons on the page - long because of large amount of chapters present in drop downs
//Chapter 1
chapterOneButt = document.getElementById("chapterOne");
scPopButt = document.getElementById("scPop");
scTrickOneButt = document.getElementById("scTrickOne");
scMedButt = document.getElementById("scMed");
scObvButt = document.getElementById("scObv");
scMythButt = document.getElementById("scMyth");
cqOneButt = document.getElementById("cqOne");
//Chapter 2
chapterTwoButt = document.getElementById("chapterTwo");
scTrickTwoButt = document.getElementById("scTrickTwo");
scAnimalButt = document.getElementById("scAnimal");
scAstroButt = document.getElementById("scAstro");
scTimeButt = document.getElementById("scTime");
scHistButt = document.getElementById("scHist");
cqTwoButt = document.getElementById("cqTwo");

/* FUNCTION INFORMATION
 * NAME - loadChapter
 * INPUTS - response, chapter, subchapter
 * OUTPUTS - none
 * PURPOSE - This is the method that converts the JSON text into the global array to cache current chapter - allow faster loading when moving through subchapters
 */
function loadChapter(response, chapter, subchapter)
{
    //Take a JSON file - parse it into the chapter array for use later
    var chapterList = JSON.parse(response);
    chapterText = chapterList.cPool[(chapter - 1)]; //Since array is 0-based -1 to get real chapter content
    loaded = true;
    if (subchapter != maxSections) //This was called by a non-quiz button
    {
        displayChapter(chapter, subchapter);
    }
    //Otherwise we want to display the quiz - not the chapter info

}

/* FUNCTION INFORMATION
 * NAME - loadChapterJSON
 * INPUTS - chapter, subchapter
 * OUTPUTS - none
 * PURPOSE - This is the method that loads the chapter text from a JSON file so that loadChpater can put it into memory
 */
function loadChapterJSON(chapter, subchapter)
{

    var xobj = new XMLHttpRequest(); //Create a request object to get the data from the JSON File
    xobj.overrideMimeType("application/json"); //Overide the deafult file type it is looking for to JSON
    xobj.open("GET", chapterJSONFile, true); //Give the name of our file (it is located locally) and tell it to load asynchronously
    //(while the rest of the code cannot function until code is loaded - sychronous requests are deprecated according to https://xhr.spec.whatwg.org/#the-open()-method)
    //We use GET as while POST more secure, GET is the only guaranteed method to work in all browsers
    //in current build - REVIEW WHEN MOVED TO FULL LIVE TESTING
    xobj.onreadystatechange = function () //What event listener activates when the task is done
    {
        if (xobj.readyState == 4 /*&& xobj.status == "200" I have removed this check now since the status will not change on local tests - RE-ENABLE ON LIVE TESTS*/) //If the the request is DONE(readyState) and OK(status) 
        {
            loadChapter(xobj.responseText, chapter, subchapter); //Send the specific chapter and starting subchapter to load
        }
    };
    xobj.send(null); //Send a null to the request to complete the transaction
}

/* FUNCTION INFORMATION
 * NAME - loadBookmarks
 * INPUTS - none
 * OUTPUTS - none
 * PURPOSE - This is the method that checks if any chapters have bookamrks already in local storage and sets them accordingly
 */
function loadBookmarks()
{

    for (ii = 0; ii < maxChapters; ii++)
    {

        for (jj = 0; jj <= maxSections; jj++) //Since there are six sections (include chapter start page)
        {
            var name = chapterIDs[ii][jj];
            var currentChapter;

            var returnVisitor = window.localStorage.getItem(name);
            if (returnVisitor === null) //No bookmark has been set for this chapter
            {
                currentChapter = new bookmark(name, ((document.getElementById(name)).innerText), null) //indicate no bookmark is set
            }
            else //There is a previous bookmark we want to use now
            {
                var origText = (document.getElementById(name)).innerText; //Store orginal text for use in replacing bookmark later
                (document.getElementById(name)).innerText = (document.getElementById(name)).innerText + returnVisitor; //Push new bookmark onto page
                currentChapter = new bookmark(name, origText, returnVisitor);
            }

            chapterMarks[ii][jj] = currentChapter; //Store it for reference later

        }

    }

}

/* FUNCTION INFORMATION
 * NAME - clearBookmarks
 * INPUTS - none
 * OUTPUTS - none
 * PURPOSE - This is the method that clears all bookmarks in local storage so a user can start again or fix a mistake
 */
function clearBookmarks()
{

    for (ii = 0; ii < maxChapters; ii++)
    {

        for (jj = 0; jj <= maxSections; jj++) //Since there are six sections (include chapter start page)
        {
            var name = chapterIDs[ii][jj];

            window.localStorage.removeItem(name); //Go through and remove each bookmark associated with each tag (no execption/problems occur if you give a tag that doesn't exist so no need to check)
            (document.getElementById(name)).innerText = chapterMarks[ii][jj].pageText; //Push old text back onto page - give user immediate feedback on clear
            var currentMark = chapterMarks[ii][jj]; //Get the bookmark object that corresponds to this section
            currentMark.symbol = null; //Set it to null so if user goes immediately back to broswing will restart bookmarking

        }

    }

}

/* FUNCTION INFORMATION
 * NAME - displayChapter
 * INPUTS - chapter, subchapter
 * OUTPUTS - none
 * PURPOSE - This is the method that pushes the next chapter text into the HTML of the page - also performs sanity check on navigation buttons
 */
function displayChapter(chapter, subchapter)
{

    if (subchapter === 0) //This is the start of the chapter
    {
        textArea.innerHTML = chapterText[subchapter].sectionHeader + chapterText[subchapter].sectionText + startSectionButt + additonalBookmarks_2;
        //Since we know this section only has a next button set it's listener up
        nextButt = document.getElementById("nextButt");
        if ((subchapter + 1) <= maxSections)
        {
            nextButt.addEventListener('click', function ()
            {
                var currentMark = chapterMarks[(chapter - 1)][subchapter]; //Get the bookmark object that corresponds to this chapter (-1 since chapter array is 0-based)
                if (currentMark.symbol === importantMark) //If marked as important - leave as is
                {
                    //We capture this and do nothing so users can leave chapters marked as important (need to remember where this is)
                    //So they can continue to refer back to it
                }
                else //We set it to done
                {
                    var name = currentMark.pageName;
                    (document.getElementById(name)).innerText = currentMark.pageText + finishedMark; //Set the bookmark to finished
                    currentMark.symbol = finishedMark; //Set reference object to new bookmark and restore in our array
                    chapterMarks[(chapter - 1)][subchapter] = currentMark; //For if user keeps reading during this session
                    window.localStorage.setItem(name, finishedMark); //Store in local storage so can be reloaded later
                }
                selectChapter(chapter, (subchapter + 1)); //We simply take what chapter we are in and moved forward one (if not at max subchapters)
            });
        }
        else
        {
            throw "CHAPTER BUTTON ERROR"; //This is the custom exception for the chapterBugScreen
        }
    }
    else if (subchapter === (maxSections - 1)) //This is the last page of the chapter (before the quiz)
    {
        textArea.innerHTML = chapterText[subchapter].sectionHeader + chapterText[subchapter].sectionText + finalSectionButt + additonalBookmarks;
        //Set up the back button listener
        backButt = document.getElementById("backButt");
        if ((subchapter - 1) >= 0)
        {
            backButt.addEventListener('click', function ()
            {
                selectChapter(chapter, (subchapter - 1)); //We simply take what chapter we are in and moved backward one (if not at 0)
            });
        }
        else
        {
            throw "CHAPTER BUTTON ERROR";
        }

        //Set up the next button listener
        nextButt = document.getElementById("nextButt");
        if ((subchapter + 1) <= maxSections)
        {
            nextButt.addEventListener('click', function ()
            {
                var currentMark = chapterMarks[(chapter - 1)][subchapter]; //Get the bookmark object that corresponds to this chapter (-1 since chapter array is 0-based)
                if (currentMark.symbol === importantMark) //If marked as important - leave as is
                {
                    //We capture this and do nothing so users can leave chapters marked as important (need to remember where this is)
                    //So they can continue to refer back to it
                }
                else //We set it to done
                {
                    var name = currentMark.pageName;
                    (document.getElementById(name)).innerText = currentMark.pageText + finishedMark; //Set the bookmark to finished
                    currentMark.symbol = finishedMark; //Set reference object to new bookmark and restore in our array
                    chapterMarks[(chapter - 1)][subchapter] = currentMark; //For if user keeps reading during this session
                    window.localStorage.setItem(name, finishedMark); //Store in local storage so can be reloaded later
                }
                //Set up the HTML to inject the quiz into
                displayQuiz(chapter, subchapter); //Use a subchapter so actual chapter subchapters lengthcan be fluid (chapter quiz is always the last though)
                //Now we call quiz.js to actually inject the quiz
                loadQuiz(chapter);
            });
        }
        else
        {
            throw "CHAPTER BUTTON ERROR"; //This is the custom exception for the chapterBugScreen
        }


    }
    else //In the middle
    {
        textArea.innerHTML = chapterText[subchapter].sectionHeader + chapterText[subchapter].sectionText + normalSectionButt + additonalBookmarks;
        //This section has both buttons so both need to be set up
        backButt = document.getElementById("backButt");
        if ((subchapter - 1) >= 0)
        {
            backButt.addEventListener('click', function ()
            {
                selectChapter(chapter, (subchapter - 1)); //We simply take what chapter we are in and moved backward one (if not at 0)
            });
        }
        else
        {
            throw "CHAPTER BUTTON ERROR";
        }
        nextButt = document.getElementById("nextButt");
        if ((subchapter + 1) <= maxSections)
        {
            nextButt.addEventListener('click', function ()
            {
                var currentMark = chapterMarks[(chapter - 1)][subchapter]; //Get the bookmark object that corresponds to this chapter (-1 since chapter array is 0-based)
                if (currentMark.symbol === importantMark) //If marked as important - leave as is
                {
                    //We capture this and do nothing so users can leave chapters marked as important (need to remember where this is)
                    //So they can continue to refer back to it
                }
                else //We set it to done
                {
                    var name = currentMark.pageName;
                    (document.getElementById(name)).innerText = currentMark.pageText + finishedMark; //Set the bookmark to finished
                    currentMark.symbol = finishedMark; //Set reference object to new bookmark and restore in our array
                    chapterMarks[(chapter - 1)][subchapter] = currentMark; //For if user keeps reading during this session
                    window.localStorage.setItem(name, finishedMark); //Store in local storage so can be reloaded later
                }
                selectChapter(chapter, (subchapter + 1)); //We simply take what chapter we are in and moved forward one (if not at max subchapters)
            });
        }
        else
        {
            throw "CHAPTER BUTTON ERROR";
        }

    }

    //Since every chapter page should have the reread/important HTML at the bottom (so users can mark any chapter content)
    //We can set listeners here
    rereadButt = document.getElementById("rereadButt");
    rereadButt.addEventListener('click', function ()
    {
        var currentMark = chapterMarks[(chapter - 1)][subchapter]; //Get the bookmark object that corresponds to this chapter (-1 since chapter array is 0-based)
        var name = currentMark.pageName;
        //No if check since we don't care what was previous - we overwrite no matter what
        (document.getElementById(name)).innerText = currentMark.pageText + rereadMark; //Set the bookmark to reread
        currentMark.symbol = rereadMark; //Set reference object to new bookmark and restore in our array
        chapterMarks[(chapter - 1)][subchapter] = currentMark; //For if user keeps reading during this session
        window.localStorage.setItem(name, rereadMark); //Store in local storage so can be reloaded later
    });
    importantButt = document.getElementById("importantButt");
    importantButt.addEventListener('click', function ()
    {
        var currentMark = chapterMarks[(chapter - 1)][subchapter]; //Get the bookmark object that corresponds to this chapter (-1 since chapter array is 0-based)
        var name = currentMark.pageName;
        if (currentMark.symbol === importantMark) //If it was already set to important - unmark since important overrides the completed check
        {
            (document.getElementById(name)).innerText = currentMark.pageText + unfinishedMark; //Set the bookmark to unfinished so user can complete it
            currentMark.symbol = unfinishedMark; //Set reference object to new bookmark and restore in our array
            chapterMarks[(chapter - 1)][subchapter] = currentMark; //For if user keeps reading during this session
            window.localStorage.setItem(name, unfinishedMark); //Store in local storage so can be reloaded later
        }
        else
        {
            (document.getElementById(name)).innerText = currentMark.pageText + importantMark; //Set the bookmark to important
            currentMark.symbol = importantMark; //Set reference object to new bookmark and restore in our array
            chapterMarks[(chapter - 1)][subchapter] = currentMark; //For if user keeps reading during this session
            window.localStorage.setItem(name, importantMark); //Store in local storage so can be reloaded later
        }

    });

    loadDefinitions(); //We call this fucntion to load any definitions that may be present on the page

}

/* FUNCTION INFORMATION
 * NAME - displayQuiz
 * INPUTS - chapter, subchapter
 * OUTPUTS - none
 * PURPOSE - This is the method that pushes the chapter quiz HTML into the center of the page - also performs sanity check on navigation buttons
 */
function displayQuiz(chapter, subchapter)
{
    var currentMark = chapterMarks[(chapter - 1)][subchapter]; //Get the bookmark object that corresponds to this chapter (-1 since chapter array is 0-based)
    if (currentMark.symbol === null) //If there was no bookmark set
    {
        var name = currentMark.pageName;
        (document.getElementById(name)).innerText = currentMark.pageText + unfinishedMark; //Set the bookmark to unfinished
        currentMark.symbol = unfinishedMark; //Set reference object to new bookmark and restore in our array
        chapterMarks[(chapter - 1)][subchapter] = currentMark; //For if user keeps reading during this session
        window.localStorage.setItem(name, unfinishedMark); //Store in local storage so can be reloaded later
    }

    //Since everytime we want to display a new section - refocus the window to the top so the user always starts at the start of the page
    document.body.scrollTop = document.documentElement.scrollTop = 0;

    if (loaded === false) //No other chapter content loaded
    {
        loadChapterJSON(chapter, subchapter); //Call loadJSON and load splash screen to to ensure that chapter content is loaded
    }

    textArea.innerHTML = quizLayout;
    //The chapter quiz uses the variables back/nextButt but their layout is different to represent the quiz being the bookend of the chapter
    backButt = document.getElementById("returnButt");
    if ((chapter - 1) >= 0) //Should never be - but just in case
    {
        backButt.addEventListener('click', function ()
        {
            selectChapter(chapter, 0); //A likely outcome of going back from the quiz is wanting to re read the chapter so we take the user all the way back to the start 
        });
    }
    else
    {
        throw "CHAPTER BUTTON ERROR";
    }
    nextButt = document.getElementById("continueButt");
    if ((chapter + 1) <= maxChapters)
    {
        nextButt.addEventListener('click', function ()
        {
            var currentMark = chapterMarks[(chapter - 1)][subchapter]; //Get the bookmark object that corresponds to this chapter (-1 since chapter array is 0-based)
            if (currentMark.symbol === finishedMark) 
            {
                //If this quiz was already completed - ignore
            }
            else //We mark it complete
            {
                var name = currentMark.pageName;
                (document.getElementById(name)).innerText = currentMark.pageText + finishedMark; //Set the bookmark to finished
                currentMark.symbol = finishedMark; //Set reference object to new bookmark and restore in our array
                chapterMarks[(chapter - 1)][subchapter] = currentMark; //For if user keeps reading during this session
                window.localStorage.setItem(name, finishedMark); //Store in local storage so can be reloaded later
            }

            loaded = false; //Since we are moving on to another chapter - we need to make sure the site loads the next chapter set
            selectChapter((chapter + 1), 0); //We simply take what chapter we are in and move on to the next one (if not at maxChapters)
        });
    }
    else //We are at the end of the list of chapters and so at this point just mark the quiz complete
    {
        nextButt.addEventListener('click', function ()
        {
            var currentMark = chapterMarks[(chapter - 1)][subchapter]; //Get the bookmark object that corresponds to this chapter (-1 since chapter array is 0-based)
            if (currentMark.symbol === finishedMark) 
            {
                //If this quiz was already completed - ignore
            }
            else //We mark it complete
            {
                var name = currentMark.pageName;
                (document.getElementById(name)).innerText = currentMark.pageText + finishedMark; //Set the bookmark to finished
                currentMark.symbol = finishedMark; //Set reference object to new bookmark and restore in our array
                chapterMarks[(chapter - 1)][subchapter] = currentMark; //For if user keeps reading during this session
                window.localStorage.setItem(name, finishedMark); //Store in local storage so can be reloaded later
            }
        });
    }

}

/* FUNCTION INFORMATION
 * NAME - selectChapter
 * INPUTS - subchapter, section
 * OUTPUTS - none
 * PURPOSE - This is the method that loads the chapter into the page
 */
function selectChapter(chapter, subchapter)
{

    var currentMark = chapterMarks[(chapter - 1)][subchapter]; //Get the bookmark object that corresponds to this chapter (-1 since chapter array is 0-based)
    if (currentMark.symbol === null) //If there was no bookmark set
    {
        var name = currentMark.pageName;
        (document.getElementById(name)).innerText = currentMark.pageText + unfinishedMark; //Set the bookmark to unfinished
        currentMark.symbol = unfinishedMark; //Set reference object to new bookmark and restore in our array
        chapterMarks[(chapter - 1)][subchapter] = currentMark; //For if user keeps reading during this session
        window.localStorage.setItem(name, unfinishedMark); //Store in local storage so can be reloaded later
    }

    //Since everytime we want to display a new chapter section - refocus the window to the top so the user always starts at the start of the page
    document.body.scrollTop = document.documentElement.scrollTop = 0;

    if (loaded === true) //If the JSON has been loaded - just display what is in memory
    {
        displayChapter(chapter, subchapter); //This only happens when from a button - direct user call to this function
    }
    else //User clicked a tab
    {
        loadChapterJSON(chapter, subchapter); //Load chapter content from the JSON
    }

}

/* FUNCTION INFORMATION
 * NAME - findDefinition
 * INPUTS - ID
 * OUTPUTS - none
 * PURPOSE - This is the method that changes window focus to given definition tag
 */
function findDefinition(ID)
{
    while (!loaded)
    {
        //Until Chapter content loaded wait
    }

    defineAnchor = document.getElementById(ID);
    defineAnchor.scrollIntoView();
}

try
{
    loadBookmarks(); //Load all intial bookmarks
}
catch (bug) //It's a joke. I do that.
{
    //If any of the buttons fail we need to error out - they all fail on the same logic so they can easily be grouped
    if (bug === "CHAPTER BUTTON ERROR") //This is our custom exception that a chapter button has failed
    {
        textArea.innerHTML = chapterBugScreen + "ERROR: Something went wrong with the chapter set-up";
    }
    else if (bug instanceof SyntaxError) //JSON parsing error
    {
        textArea.innerHTML = headersBugScreen + "<p>Problem parsing JSON input</p>";
    }
    else if (bug instanceof RangeError) //An array/list went out of bounds
    {
        textArea.innerHTML = headersBugScreen + "<p>You're out of bounds - here be dragons</p>";
    }
    else if (bug instanceof TypeError) //A variable had a bad type/object function syntax used on it
    {
        textArea.innerHTML = headersBugScreen + "<p>A resource was thought to be a type different to what it actually was (Scandalous :O)</p>";
    }
    else if (bug instanceof ReferenceError) //A object was derefenced badly
    {
        textArea.innerHTML = headersBugScreen + "<p>Problem accessing webpage resources</p>";
    }
    else if (bug instanceof InternalError) //Javascript engine error
    {
        textArea.innerHTML = headersBugScreen + "<p>Problem with javascript engine</p>";
    }
    else //Was not an error type we expected to be thrown
    {
        textArea.innerHTML = headersBugScreen + "<p>An unknown error occured</p>";
    }

}

//Button listeners for when the user moves chapters/subchapters - pass the value for the chapter + subchapter they tag

//Buttons to go to top nav bar pages
homeButt.addEventListener('click', function ()
{
    textArea.innerHTML = homePage;
});
newsButt.addEventListener('click', function ()
{
    textArea.innerHTML = newsPage;
});
tutorialButt.addEventListener('click', function ()
{
    textArea.innerHTML = tutorialPage;
});
faqButt.addEventListener('click', function ()
{
    textArea.innerHTML = faqPage;
});
contactsButt.addEventListener('click', function ()
{
    textArea.innerHTML = contactsPage;
});
clearBookButt.addEventListener('click', function ()
{
    clearBookmarks();
});

//Chapter 1
chapterOneButt.addEventListener('click', function ()
{
    dropDown = document.getElementsByClassName("cOne"); //Get the associated dropdown menu icon and click it
    dropDown[0].click(); 

    loaded = false; //We assume since the user has clicked a tab button - that they are switching out of a previous chapter - safe so we always load chapter content correctly
    selectChapter(1, 0);
});
scPopButt.addEventListener('click', function ()
{
    loaded = false; //We assume since the user has clicked a tab button - that they are switching out of a previous chapter - safe so we always load chapter content correctly
    selectChapter(1, 1);
});
scTrickOneButt.addEventListener('click', function ()
{
    loaded = false; //We assume since the user has clicked a tab button - that they are switching out of a previous chapter - safe so we always load chapter content correctly
    selectChapter(1, 2);
});
scMedButt.addEventListener('click', function ()
{
    loaded = false; //We assume since the user has clicked a tab button - that they are switching out of a previous chapter - safe so we always load chapter content correctly
    selectChapter(1, 3);
});
scObvButt.addEventListener('click', function ()
{
    loaded = false; //We assume since the user has clicked a tab button - that they are switching out of a previous chapter - safe so we always load chapter content correctly
    selectChapter(1, 4);
});
scMythButt.addEventListener('click', function ()
{
    loaded = false; //We assume since the user has clicked a tab button - that they are switching out of a previous chapter - safe so we always load chapter content correctly
    selectChapter(1, 5);
});
cqOneButt.addEventListener('click', function ()
{
    loaded = false; //We assume since the user has clicked a tab button - that they are switching out of a previous chapter - safe so we always load chapter content correctly
    //Set up the HTML to inject the quiz into
    displayQuiz(1, 6); //Use a subchapter so actual chapter subchapters lengthcan be fluid (chapter quiz is always the last though)
    //Now we call quiz.js to actually inject the quiz
    loadQuiz(1);
});

//Chapter 2
chapterTwoButt.addEventListener('click', function ()
{
    dropDown = document.getElementsByClassName("cTwo"); //Get the associated dropdown menu icon and click it
    dropDown[0].click(); 

    loaded = false; //We assume since the user has clicked a tab button - that they are switching out of a previous chapter - safe so we always load chapter content correctly
    selectChapter(2, 0);
});
scTrickTwoButt.addEventListener('click', function ()
{
    loaded = false; //We assume since the user has clicked a tab button - that they are switching out of a previous chapter - safe so we always load chapter content correctly
    selectChapter(2, 1);
});
scAnimalButt.addEventListener('click', function ()
{
    loaded = false; //We assume since the user has clicked a tab button - that they are switching out of a previous chapter - safe so we always load chapter content correctly
    selectChapter(2, 2);
});
scAstroButt.addEventListener('click', function ()
{
    loaded = false; //We assume since the user has clicked a tab button - that they are switching out of a previous chapter - safe so we always load chapter content correctly
    selectChapter(2, 3);
});
scTimeButt.addEventListener('click', function ()
{
    loaded = false; //We assume since the user has clicked a tab button - that they are switching out of a previous chapter - safe so we always load chapter content correctly
    selectChapter(2, 4);
});
scHistButt.addEventListener('click', function ()
{
    loaded = false; //We assume since the user has clicked a tab button - that they are switching out of a previous chapter - safe so we always load chapter content correctly
    selectChapter(2, 5);
});
cqTwoButt.addEventListener('click', function ()
{
    loaded = false; //We assume since the user has clicked a tab button - that they are switching out of a previous chapter - safe so we always load chapter content correctly
    //Set up the HTML to inject the quiz into
    displayQuiz(2, 6); //Use a subchapter so actual chapter subchapters lengthcan be fluid (chapter quiz is always the last though)
    //Now we call quiz.js to actually inject the quiz
    loadQuiz(2);
});