﻿/* AUTHOR INFORMATION
 * CREATOR - Jeremy Dunnet 24/08/2018
 * LAST MODIFIED BY - Jeremy Dunnet 30/08/2018 
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
 * 30/08/2018 - Updated to retrieve questions from a JSON file
 */

/* REFERENCES
 * All code/implementation was adapted/learned from the tutorial on JavaScript Quiz at https://www.sitepoint.com/simple-javascript-quiz/
 * The function loadJSON and it's impact on the code was learned/adpated from https://codepen.io/KryptoniteDove/post/load-json-file-locally-using-pure-javascript
 * And many tutorials/documentation from https://www.w3schools.com 
 */

//Global file variable declarations here.

//Thes are the ID variables we will use to access the html objects in the provided .html document
const quizContainer = document.getElementById("quiz");
const resultsContainer = document.getElementById("results");
const submitButton = document.getElementById("submitButt");
const returnButton = document.getElementById("returnButt");
const continueButton = document.getElementById("continueButt");

//We want a constant pass result we can use for a continue button and any future "pass required" features
const passMark = 5;
//Variable to hold the maximum number of questions for this chapter in the database (for generating random numbers later)
const QMAX = 25;

//Set a global container for the url value for the continue button
continueHref = "";

//This is the global container for the selected 10 questions the quiz will use throughout the page
myQuestions = new Array[10];

//We will use this variables to track what question we are on and then when it is answered correctly we move on to the next
numCorrect = 0;

//Function declarations

/* FUNCTION INFORMATION
 * NAME - buildQuiz
 * INPUTS - none
 * OUTPUTS - none (Data is reflected to the screen inside the function)
 * PURPOSE - This is the function to begin build/setup of the quiz by obtaining the randomized questions and creating the sections
 *           of each questions element in HTML
 */
function buildQuiz()
{
    //Store all html output from the page
    const output = [];

    //For every question create a display frame
    for (ii = 0; ii < questions.length; ii++)
    {

        currentQuestion = questions[ii];

        //Store all choices for each question
        const answers = [];

        //Push the question choices to an array for display
        for (letter in currentQuestion.answers)
        {

            // Add the choice and a button for user to select it as the answer
            answers.push
                (
                `<div class="choices">
                        <input type="radio" name="question${ii}" value="${letter}">
                            ${letter} :
                            ${currentQuestion.answers[letter]}
                     </div>`
                );
        }

        //Add the built question to the output
        output.push
            (
            `<div class="question"> ${currentQuestion.question} </div>
                 <div class="answers"> ${answers.join('')} </div>
                 <div class="reasoning"> ${currentQuestion.reasoning} </div> <br ?>`
            );

    }

    //Put the finished questions back on the page
    quizContainer.innerHTML = output.join("");
}

/* FUNCTION INFORMATION
 * NAME - loadJSON
 * INPUTS - none
 * OUTPUTS - questions (Array of randomly selected questions from another source (Database/JSON/Object Array etc.))
 * PURPOSE - This is the method that randomly selected questions from a source by using Math.random to generate a number within a set
 *           bound and then pulling the question with that numerical id into the array to be returned
 */
function loadJSON(callback)
{

    var xobj = new XMLHttpRequest(); //Create a request object to get the data from the JSON File
    xobj.overrideMimeType("application/json");
    xobj.open('GET', 'my_data.json', true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function ()
    {
        if (xobj.readyState == 4 && xobj.status == "200")
        {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
}

/* FUNCTION INFORMATION
 * NAME - setQuestions
 * INPUTS - none
 * OUTPUTS - questions (Array of randomly selected questions from another source (Database/JSON/Object Array etc.))
 * PURPOSE - This is the method that randomly selected questions from a source by using Math.random to generate a number within a set
 *           bound and then pulling the question with that numerical id into the array to be returned
 */
function setQuestions()
{

    var questions = new Array(10); //An array to store our questions
    var index; //Used to store the unique random number
    var indexes = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; //Store all previously generated numbers
    finished = false; //We will use this to control the main loop

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
        questions[ii] = myQuestions[index]; //Put the generated question in the loop
        //HERE IS WHERE THE DATABASE IMPLEMENTATION COMES IN
        //Once we have the index (corresponds to the unique ID key of the databases chapter 1 questions table) we would send a query to retrieve that tuple
        //Then we parse and extract each column into our myQuestion object

    }

    return questions; //Give it back to buildQuiz

}

/* FUNCTION INFORMATION
 * NAME - showResults
 * INPUTS - none
 * OUTPUTS - none (changes to the corresponding HTML are reflected back within this function)
 * PURPOSE - This function is activated on button press when the user has finished the quiz, collates the answers and evaluates them
 *           to be displayed back to them as a score (with the reasoning unhidden beneath each question to give users help in
 *           understanding why an answer is correct)
 */
function showResults()
{
    //Get all answers the user selected in the quiz from the page
    const answerContainers = quizContainer.querySelectorAll(".answers");

    //Go through each question and check the answer
    for (ii = 0; ii < questions.length; ii++)
    {

        //Find the answer the user selected for this question
        const answerContainer = answerContainers[ii];
        const currentQuestion = questions[ii];
        const selector = "input[name=question" + ii + "]:checked";
        const userAnswer = (answerContainer.querySelector(selector) || {}).value;

        //If the got the correct answer or hit one of my trick questions and at least selected an answer
        if ((userAnswer === currentQuestion.correctAnswer) || (((typeof userAnswer) !== "undefined") && (currentQuestion.correctAnswer === "D")))
        {

            const choicesContainer = answerContainer.querySelectorAll(".choices"); //Grab all the choices
            var correctChoice; //Where we will store the correct choice
            numCorrect++;

            for (jj = 0; jj < 3; jj++) //Iterate through every choice
            {
                currentChoice = choicesContainer[jj];
                choiceValue = currentChoice.querySelector(selector); //Since they picked the right answer - the :checked selector will
                                                                     //find it
                if (choiceValue !== null) //Only accept the querySelector that returns a valid element
                {
                    correctChoice = currentChoice;
                }
            }

            correctChoice.style.color = "green"; //Color and add a tick to reaffirm how smart  the user is
            correctChoice.innerHTML += "✔"; //UTF-8 symbol for tick mark (U+2713)

        }
        //If they got it wrong (including no answer)
        else
        {
            if ((typeof userAnswer) !== "undefined") //If they selected an answer
            {

                const choicesContainer = answerContainer.querySelectorAll(".choices"); //Grab all the choices
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
                incorrectChoice.innerHTML += "✖";  //UTF-8 symbol for heavy multiplication (U+2716)

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
                correctChoice.innerHTML += "✔"; //UTF-8 symbol for tick mark (U+2713)
            }

            //If they didn't select an answer then we don't change the color of the unchecked answers - if they want to be that lazy
            //so can I!

            /* Added this if we decide to allow trick questions to show that all the answers were correct
             * Only for if above comment turns out to be not the desired fucntionality for skipped questions
             * if (currentQuestion.correctAnswer === "D") //It's a trick/all of the above question so we need to select them all
                                                       //So they can know I tricked them!
            {
                const choicesContainer = answerContainer.querySelectorAll(".choices"); //Grab all the choices

                for (jj = 0; jj < 3; jj++) //Iterate through every choice
                {
                    currentChoice = choicesContainer[jj];
                    currentChoice.style.color = "green"; //Color and add a tick to reaffirm how smart  the user is
                    currentChoice.innerHTML += "✔"; //UTF-8 symbol for tick mark (U+2713)
                }

            }*/

        } 

        //Now we want to disable all the radio buttons for this questions (stops people messing with answers afterwards)
        const choiceSelector = "input[type=radio]"; //Select only radio button input tags
        const choice = answerContainer.querySelectorAll(choiceSelector); //Grab all for this question
        for (jj = 0; jj < 3; jj++)
        {
            choice[jj].disabled = true; //Disabled being able to select this
        }

    }

    //Unhide the reasoning by disabling the visibility tag
    const reasonContainer = quizContainer.querySelectorAll(".reasoning");
    for (ii = 0; ii < questions.length; ii++)
    {
        reasonContainer[ii].style.visibility = "visible";
    }


    //Place a custom congratulations message based on what score the user got
    switch (numCorrect)
    {
        case 0:
            resultsContainer.innerHTML = '<p align="center">' + numCorrect + " out of " + questions.length + "<br />" + "You suck." + "</p>";
            break;
        case 1:
        case 2:
        case 3:
            resultsContainer.innerHTML = '<p align="center">' + numCorrect + " out of " + questions.length + "<br />" + "Come on man." + "</p>";
            break;
        case 4:
            resultsContainer.innerHTML = '<p align="center">' + numCorrect + " out of " + questions.length + "<br />" + "Bad Luck Brian" + "</p>";
            break;
        case 5:
            resultsContainer.innerHTML = '<p align="center">' + numCorrect + " out of " + questions.length + "<br />" + "Just snuck in there didn't ya!" + "</p>";
            break;
        case 6:
        case 7:
            resultsContainer.innerHTML = '<p align="center">' + numCorrect + " out of " + questions.length + "<br />" + "Not too shabby!" + "</p>";
            break;
        case 8:
        case 9:
            resultsContainer.innerHTML = '<p align="center">' + numCorrect + " out of " + questions.length + "<br />" + "Nearly there!" + "</p>";
            break;
        case 10:
            resultsContainer.innerHTML = '<p align="center">' + numCorrect + " out of " + questions.length + "<br />" + "Ultimate Quiz Master" + "</p>";
            break;

    }

    //Now we want to edit which continue button they get based on if they passed or not
    if (numCorrect >= passMark)
    {
 
        continueVal = document.getElementById("continueButt"); //Grab the button element
        continueVal.innerHTML = "Next Chapter";
        continueVal.style.color = "#fff";  //Change the colors back to the "normal" button settings
        continueVal.style.backgroundColor = "#279";
        continueVal.disabled = false;  //Remove the lock on the button and return cursor to standard as well
        continueVal.style.cursor = "pointer";
        continueHref = "chapterTwoQuiz.html"; //CHAPTER CONTENT HAS NOT YET BEEN IMPLEMENTED - EDIT ONCE THIS IS DONE

    }
    else
    {

        continueVal = document.getElementById("continueButt"); //Grab the button element
        continueVal.innerHTML = "Back to start of Chapter";
        continueVal.style.color = "#fff"; //Change the colors back to the "normal" button settings
        continueVal.style.backgroundColor = "#279";
        continueVal.disabled = false; //Remove the lock on the button and return cursor to standard as well
        continueVal.style.cursor = "pointer";
        continueHref = "chapterOnequiz.html"; //CHAPTER CONTENT HAS NOT YET BEEN IMPLEMENTED - EDIT ONCE THIS IS DONE

    }

    //Now that the results submission is done - we disable the submit results button so it also can't be clicked by curious people
    submitButton.style.backgroundColor = "gray";
    submitButton.style.cursor = "not-allowed";
    submitButton.disabled = true;

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
 * PURPOSE - This button event method takes to user to the value of continueHref (which is set based on quiz score) to either the
 *           next chapter or to reread the previous one based on if they passed or not
 */
function goForward()
{
    window.location.assign(continueHref);
}

//Code starts here

//We need to build the quiz first
const questions = setQuestions();

//Then we build the quiz
buildQuiz();

//Once the user clicks submit - show them their results
submitButton.addEventListener("click", showResults);

//If the user clicks return - go back to the quiz selector page
returnButton.addEventListener("click", goBack);

//If the user completes the quiz - we will take them top what continueHref is set to
continueButton.addEventListener("click", goForward);