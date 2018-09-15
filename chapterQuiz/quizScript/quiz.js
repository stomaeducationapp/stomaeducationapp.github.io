/* AUTHOR INFORMATION
 * CREATOR - Jeremy Dunnet 24/08/2018
 * LAST MODIFIED BY - Jeremy Dunnet 03/09/2018 
 */

/* CLASS/FILE DESCRIPTION
 * This is the javascript file for building, handling and displaying the chapter quizzes
 * Each quiz .html page will import identifiers to which chapter they are for - allowing the database to return chapter unique questions
 * The rest of the code is the same for each quiz - which is why we do not need more than one file
 */

/* VERSION HISTORY
 * 24/08/2018 - Added quizStart.html and basic styling of that page
 * 25/08/2018 - Added quiz.js (and coresponding css) and chapterXQuiz.html pages and adapted code from below reference tutorial to
 *              fill quiz.js with code and connect to chapterOneQuiz.html (Became fully functional but not fully tested)
 * 27/08/2018 - Added new functionality to handle second naviagtion button and reasoning under each question
 * 28/08/2018 - Reworked question functionality to act as close as possible to "database" without actual database present
 * 29/08/2018 - Fixed comments to reflect group standard, reworked answer html build, reworked answer highlighting and added
 *              quiz feature disabling after submission
 * 30/08/2018 - Updated to retrieve questions from a JSON file, redesigned layout to fit new decided style
 * 02/09/2018 - Updated code related to new layout - fixing bugs and uneeded lines 
 * 03/09/2018 - Added as much exception handling as I could find for this code and cleaned up more unused code
 */

/* REFERENCES
 * All code/implementation was adapted/learned from the tutorial on JavaScript Quiz at https://www.sitepoint.com/simple-javascript-quiz/
 * The function loadJSON and it's impact on the code was learned/adpated from https://codepen.io/KryptoniteDove/post/load-json-file-locally-using-pure-javascript
 * Scroll up fucntionality was learned/adapted from https://stackoverflow.com/questions/19311301/how-to-scroll-back-to-the-top-of-page-on-button-click
 * Radio button listener code was learned/adpated from http://www.dynamicdrive.com/forums/showthread.php?74477-How-do-you-attach-an-event-listener-to-radio-button-using-javascript
 * Javascript exception handling learned/adapted from https://stackoverflow.com/questions/4467044/proper-way-to-catch-exception-from-json-parse
 * And many tutorials/documentation from https://www.w3schools.com 
 */

//Global file variable declarations here.

//Thes are the ID variables we will use to access the html objects in the provided .html document
//Chapter Section
const informationContainer = document.getElementById("information");
//Question Section
const quizTitleContainer = document.getElementById("qTitle");
const answersContainer = document.getElementById("answers");
const reasoningContainer = document.getElementById("reasoning");
const scoreContainer = document.getElementById("score");
const encouragementContainer = document.getElementById("encouragement");
//Buttons
const returnButton = document.getElementById("returnButt");
const retryButton = document.getElementById("retryButt");
const nextButton = document.getElementById("nextButt");
const continueButton = document.getElementById("continueButt");
//Body - for error handling
const body = document.getElementById("body");

//A html body for the error screen
const bugScreen = "<p>Looks like an error has occured.<br />To try and fix the issue:<ul><li>Refresh the page</li><li>Close the window and reload</li><li>Try from a different browser - supported browsers include:<ul><li>Chrome (Version 68 and above)</li><li>Edge (Version 17 and above)</li><li>Opera (Version 55 and above)</li></ul></li></ul></p>";

//Variable to hold the maximum number of questions for this chapter in the database (for generating random numbers later)
const QMAX = 25;

//This is the global container for the selected 10 questions the quiz will use throughout the page
var myQuestions = new Array(10);

//We will use this variable to track what question we are on and then when it is answered correctly we move on to the next
var numCorrect;

//A const name for the corresponding JSON file we will use to simulate a request to a database - path is weird due to the XMLHTTPRequest object
//gets its path from the linked HTML page rather than this document. The JSON file does not allow comments so it's comment block is located below
/* AUTHOR INFORMATION
 * CREATOR - Jeremy Dunnet 30/08/2018
 * LAST MODIFIED BY - Jeremy Dunnet 15/09/2018
 * 
 * CLASS/FILE DESCRIPTION
 * The JSON acts as a mock database - which can be filled with arrays pertaining to the pool of questions available for that chapter
 * Each array has a unique name which can be placed used in the specific chapter .js file to allow only questions from the relevant chapter to be selected
 * The JSON file is also parsed directly into a javascript object so it can be used easily
 * 
 * VERSION HISTORY
 * 30/08/2018 - Created and laid out to needs of the .js code and added the revisionText field (really long but all gibberish)
 * 02/09/2018 - Added titles to revisionText and some typo fixes
 * 12/09/2018 - Updated to readd missing questions and reworked JSON array names/ordering to allow for dymanic chapter loading
 * 
 * REFERENCES
 * All tutorials on setup and design of simple JSON files was adapted/learned from https://www.w3schools.com
 * 
 */

const jsonFile = "../quizScript/questionList.json";

//Function declarations

/* FUNCTION INFORMATION
 * NAME - buildQuestion
 * INPUTS - none
 * OUTPUTS - none (Data is reflected to the screen inside the function)
 * PURPOSE - This is the function to build the next question in the Question div (either refresh if got wrong or create new if got right)
 */
function buildQuestion()
{
    //Since everytime we want to display a new question - refocus the window to the top so the user always starts at the start of the page
    document.body.scrollTop = document.documentElement.scrollTop = 0;

    //Store all html output from the page
    const answers = [];

    currentQuestion = myQuestions[numCorrect]; //We select the question based on number correct as that correlates to the current array question


    //Push the question choices to an array for display
    for (letter in currentQuestion.answers)
    {
        //Add the choice and a button for user to select it as the answer
        answers.push
            (
            '<div class="choices"> <input type="radio" name="question' + numCorrect + '" value="' + letter + '"> ' + letter +  ' : ' + currentQuestion.answers[letter] + '</div>'
            );
    }

    //Put the finished question back on the page
    quizTitleContainer.innerHTML = currentQuestion.question;
    reasoningContainer.innerHTML = currentQuestion.reasoning;
    reasoningContainer.style.visibility = "hidden";
    informationContainer.innerHTML = currentQuestion.revisionText;
    answersContainer.innerHTML = answers.join("");

    //Set all buttons to disabled and hide their text
    retryButton.disabled = true;
    retryButton.style.color = "gray";  //Change the colors back to the "disabled" button settings
    retryButton.style.backgroundColor = "gray";
    retryButton.style.cursor = "not-allowed";

    nextButton.disabled = true;
    nextButton.style.color = "gray";  //Change the colors back to the "disabled" button settings
    nextButton.style.backgroundColor = "gray";
    nextButton.style.cursor = "not-allowed";

    continueButton.disabled = true;
    continueButton.style.color = "gray";  //Change the colors back to the "disabled" button settings
    continueButton.style.backgroundColor = "gray";
    continueButton.style.cursor = "not-allowed";


    //Now that the radio buttons are back on the page - let's set a event listener to activate when one is clicked
    var radioButtons = document.getElementsByName("question" + numCorrect);

    for (ii = 0; ii < radioButtons.length; ii++)
    {
        radioButtons[ii].onclick = showResult;
    }
 
}

/* FUNCTION INFORMATION
 * NAME - loadJSON
 * INPUTS - none
 * OUTPUTS - none
 * PURPOSE - This is the method that loads the question list from a JSON file so that setQuestions can pick the random 10
 */
function loadJSON(chapter)
{

    var xobj = new XMLHttpRequest(); //Create a request object to get the data from the JSON File
    xobj.overrideMimeType("application/json"); //Overide the deafult file type it is looking for to JSON
    xobj.open("GET", jsonFile, true); //Give the name of our file (it is located locally) and tell it to load asynchronously
                                        //(while the rest of the code cannot function until code is loaded - sychronous requests are deprecated according to https://xhr.spec.whatwg.org/#the-open()-method)
                                        //We use GET as while POST more secure, GET is the only guaranteed method to work in all browsers
                                        //in current build - REVIEW WHEN MOVED TO FULL LIVE TESTING
    xobj.onreadystatechange = function () //What event listener activates when the task is done
    {
        if (xobj.readyState == 4 /*&& xobj.status == "200" I have removed this check now since the status will not change on local tests - RE-ENABLE ON LIVE TESTS*/) //If the the request is DONE(readyState) and OK(status) 
        {
            setQuestions(chapter, xobj.responseText);
        }
    };
    xobj.send(null); //Send a null to the request to complete the transaction
}

/* FUNCTION INFORMATION
 * NAME - loadQuiz
 * INPUTS - none
 * OUTPUTS - none
 * PURPOSE - This is the method that loads the question list from a JSON file so that setQuestions can pick the random 10
 */
function loadQuiz()
{



}

/* FUNCTION INFORMATION
 * NAME - setQuestions
 * INPUTS - response (a JSON data object retrieved from the question list JSON file)
 * OUTPUTS - questions (Array of randomly selected questions from another source (Database/JSON/Object Array etc.))
 * PURPOSE - This is the method that randomly selected questions from a source by using Math.random to generate a number within a set
 *           bound and then pulling the question with that numerical id into the array to be returned
 */
function setQuestions(chapter, response)
{

    var index; //Used to store the unique random number
    var indexes = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; //Store all previously generated numbers
    finished = false; //We will use this to control the main loop

    //JSON unpacking
    var questionList = JSON.parse(response);

    for(ii = 0; ii < indexes.length; ii++) //Until we have filled all ten slots
    {
        same = true;

        while (same != false) //Make sure we get a new unique number each time
        {

            index = (Math.floor((Math.random() * QMAX) /* Currently commented out since the hard coded array is 0-indexed REMOVE WHEN DATABASE IN!!! + 1*/)); //Get a random number between 1 and the maximum number of questions for this chapter
            same = false; //We assume this is a new unique number until the for loop finishes
            for (jj = 0; jj < indexes.length; jj++) //Now we check that this new number is not the same as any before
            {

                if (index == indexes[jj])
                {
                    same = true; //If it is this will continue the loop until we get a unique one
                }

            }

        }

        indexes[ii] = index; //Assign it to the record for use in next iteration
        myQuestions[ii] = questionList.qPool[(chapter - 1)][index]; //Put the generated question in the loop - we -1 the chapter since JSON array is 0-based

        //HERE IS WHERE THE DATABASE IMPLEMENTATION COMES IN
        //Once we have the index (corresponds to the unique ID key of the databases chapter 1 questions table) we would send a query to retrieve that tuple
        //Then we parse and extract each column into our myQuestion object

    }

    //Call buildQuestion to start assembling the first question - which we have set by assigning 0 to numCorrect (0-based array)
    numCorrect = 0;
    buildQuestion();

}

/* FUNCTION INFORMATION
 * NAME - showResult
 * INPUTS - none
 * OUTPUTS - none (changes to the corresponding HTML are reflected back within this function)
 * PURPOSE - This function is activated on selection of an answer when the user decides and what to choose for the given question,
 *           we then evaluate the answer and reflect it in a score and encouragement statement. If they got it wrong they are given a
 *           chance to retry, if they got it correct they can continue to the next question
 *           (with the reasoning unhidden beneath each question to give users help in understanding why an answer is correct)
 */
function showResult()
{
    //Get all answers the user selected in the question from the page
    const choicesContainer = answersContainer.querySelectorAll(".choices");


    const currentQuestion = myQuestions[numCorrect];
    const selector = "input[name=question" + numCorrect + "]:checked";
    const userAnswer = (answersContainer.querySelector(selector) || {}).value;

    //If the got the correct answer or hit one of my trick questions and at least selected an answer
    if ((userAnswer === currentQuestion.correctAnswer) || (((typeof userAnswer) !== "undefined") && (currentQuestion.correctAnswer === "D")))
    {

        numCorrect++; //Increment the number of questions they got correct
        var correctChoice;

        for (jj = 0; jj < 3; jj++) //Iterate through every choice
        {
            currentChoice = choicesContainer[jj];
            choiceValue = currentChoice.querySelector(selector); //Since they picked the wrong answer - the :checked selector will
            //find it
            if (choiceValue !== null) //Only accept the querySelector that returns a valid element
            {
                correctChoice = currentChoice;
            }
        }

        correctChoice.style.color = "green"; //Color and add a tick to reaffirm how smart the user is
        correctChoice.innerHTML += " ✔"; //UTF-8 symbol for tick mark (U+2713)

        if (numCorrect === 10) //User has completed the quiz
        {

            //Disable the retry button - no incorrect answer
            retryButton.style.color = "gray";  //Change the colors back to the "disabled" button settings
            retryButton.style.backgroundColor = "gray";
            retryButton.disabled = true;  //Disable button press
            retryButton.style.cursor = "not-allowed";

            //Disable the next button - got it right
            nextButton.style.color = "gray";  //Change the colors back to the "disabled" button settings
            nextButton.style.backgroundColor = "gray";
            nextButton.disabled = true;  //Disable button press
            nextButton.style.cursor = "not-allowed";

            //Enable continue to next quiz buttton
            continueButton.style.color = "#464646";  //Change the colors back to the "normal" button settings
            continueButton.style.backgroundColor = "#8FBBA5";
            continueButton.disabled = false;  //Remove the lock on the button and return cursor to standard as well
            continueButton.style.cursor = "pointer";
        }
        else
        {
            //Disable the retry button - no incorrect answer
            retryButton.style.color = "gray";  //Change the colors back to the "disabled" button settings
            retryButton.style.backgroundColor = "gray";
            retryButton.disabled = true;  //Disable button press
            retryButton.style.cursor = "not-allowed";

            //Enable the next button - got it right
            nextButton.style.color = "#464646";  //Change the colors back to the "normal" button settings
            nextButton.style.backgroundColor = "#8FBBA5";
            nextButton.disabled = false;  //Remove the lock on the button and return cursor to standard as well
            nextButton.style.cursor = "pointer";
        }


    }
    //If they got it wrong (including no answer)
    else
    {
        if ((typeof userAnswer) !== "undefined") //If they selected an answer
        {
            var incorrectChoice; //Where we will store the incorrect choice

            for (jj = 0; jj < 3; jj++) //Iterate through every choice
            {
                currentChoice = choicesContainer[jj];
                choiceValue = currentChoice.querySelector(selector); //Since they picked the wrong answer - the :checked selector will
                //find it
                if (choiceValue !== null) //Only accept the querySelector that returns a valid element
                {
                    incorrectChoice = currentChoice;
                }
            }

            incorrectChoice.style.color = "red"; //Color and add a cross to say "Bad user!"
            incorrectChoice.innerHTML += " ✖";  //UTF-8 symbol for heavy multiplication (U+2716)

            //Now we need to tell the user what the right answer was so they learn
            var correctChoice; //Where we will store the correct choice
            const correctSelector = "input[value=" + currentQuestion.correctAnswer + "]";

            for (jj = 0; jj < 3; jj++) //Iterate through every choice
            {
                currentChoice = choicesContainer[jj];
                choiceValue = currentChoice.querySelector(correctSelector); //Since they picked the right answer - the :checked selector will
                //find it
                if (choiceValue !== null) //Only accept the querySelector that returns a valid element
                {
                    correctChoice = currentChoice;
                }
            }

            correctChoice.style.color = "green"; //Color and add a tick to reaffirm how smart  the user is
            correctChoice.innerHTML += " ✔"; //UTF-8 symbol for tick mark (U+2713)
        }

        //If they didn't select an answer then we don't change the color of the unchecked answers - if they want to be that lazy
        //so can I!

        /* Added this if we decide to allow trick questions to show that all the answers were correct
         * Only for if above comment turns out to be not the desired functionality for skipped questions
        if (currentQuestion.correctAnswer === "D") //It's a trick/all of the above question so we need to select them all
                                                   //So they can know I tricked them!
        {
            const choicesContainer = answerContainer.querySelectorAll(".choices"); //Grab all the choices

            for (jj = 0; jj < 3; jj++) //Iterate through every choice
            {
                currentChoice = choicesContainer[jj];
                currentChoice.style.color = "green"; //Color and add a tick to reaffirm how smart  the user is
                currentChoice.innerHTML += " ✔"; //UTF-8 symbol for tick mark (U+2713)
            }

        }*/

        //Enable the retry button - give a chance to try again
        retryButton.style.color = "#464646";  //Change the colors back to the "normal" button settings
        retryButton.style.backgroundColor = "#8FBBA5";
        retryButton.disabled = false;  //Remove the lock on the button and return cursor to standard as well
        retryButton.style.cursor = "pointer";

    }

    //Now we want to disable all the radio buttons for this questions (stops people messing with answers afterwards)
    const choiceSelector = "input[type=radio]"; //Select only radio button input tags
    const choice = answersContainer.querySelectorAll(choiceSelector); //Grab all for this question
    for (jj = 0; jj < 3; jj++)
    {
        choice[jj].disabled = true; //Disable being able to select this
    }

    //Unhide the reasoning by disabling the visibility tag
    reasoningContainer.style.visibility = "visible";

    //Place a custom congratulations message based on what score the user got
    switch (numCorrect)
    {
        case 0:
            scoreContainer.innerHTML = '<p align="center">' + numCorrect + " out of " + myQuestions.length + "</p>";
            encouragementContainer.innerHTML = '<p align="center"> Just getting started. </p>';

            //We set the borders here so they don't show up while hidden (creates a little black spot when no text inside)
            //Getting it wrong can be the first time the text shows up
            scoreContainer.style.border = "solid";
            encouragementContainer.style.border = "solid";
            break;
        case 1:
            scoreContainer.innerHTML = '<p align="center">' + numCorrect + " out of " + myQuestions.length + "</p>";
            encouragementContainer.innerHTML = '<p align="center"> Good Start! </p>';

            //We set the borders here so they don't show up while hidden (creates a little black spot when no text inside)
            //Getting the first right is also the first time the text can show up (afterwards text is just replaced)
            scoreContainer.style.border = "solid";
            encouragementContainer.style.border = "solid";
            break;
        case 2:
        case 3:
        case 4:
            scoreContainer.innerHTML = '<p align="center">' + numCorrect + " out of " + myQuestions.length + "</p>";
            encouragementContainer.innerHTML = '<p align="center"> Keep it up! </p>';
            break;
        case 5:
            scoreContainer.innerHTML = '<p align="center">' + numCorrect + " out of " + myQuestions.length + "</p>";
            encouragementContainer.innerHTML = '<p align="center"> Halfway there! </p>';
            break;
        case 6:
        case 7:
            scoreContainer.innerHTML = '<p align="center">' + numCorrect + " out of " + myQuestions.length + "</p>";
            encouragementContainer.innerHTML = '<p align="center"> You\'re going great! </p>';
            break;
        case 8:
        case 9:
            scoreContainer.innerHTML = '<p align="center">' + numCorrect + " out of " + myQuestions.length + "</p>";
            encouragementContainer.innerHTML = '<p align="center"> Nearly there! </p>';
            break;
        case 10:
            scoreContainer.innerHTML = '<p align="center">' + numCorrect + " out of " + myQuestions.length + "</p>";
            encouragementContainer.innerHTML = '<p align="center"> Ultimate quiz master! </p>';
            break;

    }

}

/* FUNCTION INFORMATION
 * NAME - goBack
 * INPUTS - none
 * OUTPUTS - none (navigates the user away from this page)
 * PURPOSE - This button event takes the user back to the main quiz select screen (substitute the main page when implemented)
 */
function goBack()
{
    window.location.assign("../quizStart.html"); 
}

/* FUNCTION INFORMATION
 * NAME -goForward
 * INPUTS - none
 * OUTPUTS - none (navigates the user away from this page)
 * PURPOSE - This button event method takes to user to the next chapter quiz since this unlocks when we have completed the quiz
 */
function goForward()
{
    //At current implementation no other chapter quizzes are fleshed out but we go there anyway
    window.location.assign("chapterTwoQuiz.html");
}


//Code starts here

try
{
    //We start but requesting the JSON to retrieve the question list
    loadJSON();
}
catch(bug) //It's a joke. I do that.
{
    //These exceptions are kept somwhat vague to decrease client knoweledge of page code (for security)
    if (bug instanceof SyntaxError) //JSON parsing error
    {
        body.innerHTML = bugScreen + "<p>Problem parsing JSON input</p>";
    }
    /* I have commeneted this out becuase the broswrs I have tested on report this exception type as not found - is only valid for some browser support
    else if (bug instanceof InvalidStateError) //XMLHTTPRequest retrieval error
    {
        body.innerHTML = bugScreen + "<p>Problem retrieving data from questions database</p>";
    }
    */ 
    else if (bug instanceof RangeError) //An array/list went out of bounds
    {
        body.innerHTML = bugScreen + "<p>You're out of bounds - here be dragons</p>";
    }
    else if (bug instanceof TypeError) //A variable had a bad type/object function syntax used on it
    {
        body.innerHTML = bugScreen + "<p>A resource was that to be a type different to what it actually was (Scandalous :O)</p>";
    }
    else if (bug instanceof ReferenceError) //A object was derefenced badly
    {
        body.innerHTML = bugScreen + "<p>Problem accessing webpage resources</p>";
    }
    else if (bug instanceof InternalError) //Javascript engine error
    {
        body.innerHTML = bugScreen + "<p>Problem with javascript engine</p>";
    }
    //I do not catch URI/Eval Errors specifically since I do not use their respective functions in this code
    //Everything else goes to an unknown error
    else
    {
        body.innerHTML = bugScreen + "<p>An unknown error occured</p>";
    }
}


//Once the user gets the answer wrong - once clicked reloads the question (since numCorrect is not incremented will rebuild same question) 
retryButton.addEventListener("click", buildQuestion);
//If the user gets the answer right - builds next question (since numCorrect incremented)
nextButton.addEventListener("click", buildQuestion);

//Listeners for when the user selects a particular chapter quiz
cOneQuizButt.addEventListener('click', function ()
{
    loadQuiz(1);
});
cTwoQuizButt.addEventListener('click', function ()
{
    loadQuiz(2);
});

//If the user clicks go back to chapter select - go back to the quiz selector page
returnButton.addEventListener("click", goBack);

//If the user completes the quiz - we will take them to the next chapter quiz
continueButton.addEventListener("click", goForward);