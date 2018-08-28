// This is the javascript file for building, handling and displaying the chapter quizzes
// Each quiz .html page will import identifiers to which chapter they are for - allowing the database to return chapter unique questions
// The rest of the code is the same for each quiz - which is why we do not need more than one file

//All code/implementation was adapted/learned from the tutorial on JavaScript Quiz at https://www.sitepoint.com/simple-javascript-quiz/
//And many tutorials/documentation from https://www.w3schools.com

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

//A initial client side based set of questions - REMOVE BEFORE RELEASE -> REPLACE WITH DATABASE RETRIEVAL
//This will be replaced with a myQuestion object that has all the same fields - but is an empty object which we build in setQuestions
const myQuestions = [
    {
        id: 1,
        question: "What time is noon?",
        answers: {
            A: "10am",
            B: "12pm",
            C: "9pm"
        },
        correctAnswer: "B",
        reasoning: "Noon is the middle of the day."
    },
    {
        id: 2,
        question: "What is a centuar?",
        answers: {
            A: "Man and Bull",
            B: "Man and Goat",
            C: "Man and Horse"
        },
        correctAnswer: "C",
        reasoning: "The centuar is a man with a horse's legs instead of his own."
    },
    {
        id: 3,
        question: "Who invented paper?",
        answers: {
            A: "China",
            B: "Japan",
            C: "America"
        },
        correctAnswer: "A",
        reasoning: "The chinese used rice-based paper as far back as 200BC."
    },
    {
        id: 4,
        question: "Who is the current Australian prime minister?",
        answers: {
            A: "Malcom Turnbull",
            B: "Scott Morrison",
            C: "Who knows today?"
        },
        correctAnswer: "C",
        reasoning: "It can change so fast apparently."
    },
    {
        id: 5,
        question: "What sound does a cat make?",
        answers: {
            A: "Woof",
            B: "Meow",
            C: "Moo"
        },
        correctAnswer: "B",
        reasoning: "If I need to explain it - then we have a problem."
    },
    {
        id: 6,
        question: "Why could you get a stoma?",
        answers: {
            A: "Just want it",
            B: "Bowel/Gut problems",
            C: "Everyone else is getting one"
        },
        correctAnswer: "B",
        reasoning: "It is used as a bypass for lower instinal/bowel issues - when they either don't function properly or need time to heal."
    },
    {
        id: 7,
        question: "What are you currently participating in?",
        answers: {
            A: "A quiz",
            B: "An interrogation",
            C: "A game show"
        },
        correctAnswer: "A",
        reasoning: "Some are pretty obvious, right?"
    },
    {
        id: 8,
        question: "Which is the correct answer?",
        answers: {
            A: "B",
            B: "C",
            C: "A"
        },
        correctAnswer: "D",
        reasoning: "Just messing with you."
    },
    {
        id: 9,
        question: "What colour is a stop sign?",
        answers: {
            A: "Blue",
            B: "Green",
            C: "Red"
        },
        correctAnswer: "C",
        reasoning: "Red is common symbol of dnager, used to make you pay attention."
    },
    {
        id: 10,
        question: "What is 2+2?",
        answers: {
            A: "4",
            B: "3",
            C: "2"
        },
        correctAnswer: "A",
        reasoning: "Use your fingers."
    },
    {
        id: 11,
        question: "How long does it take light from the sun to reach the earth?",
        answers: {
            A: "1 hour",
            B: "8 minutes",
            C: "The blink of an eye"
        },
        correctAnswer: "B",
        reasoning: "The distance between the sun and earth is 149.6 million km."
    },
    {
        id: 12,
        question: "Who is Batman's secret identity?",
        answers: {
            A: "Clark Kent",
            B: "Peter Parker",
            C: "Bruce Wayne"
        },
        correctAnswer: "C",
        reasoning: "Read a comic man."
    },
    {
        id: 13,
        question: "Why do we get night and day?",
        answers: {
            A: "They turn the sun off",
            B: "The earth's rotation",
            C: "The sun gets really far away"
        },
        correctAnswer: "B",
        reasoning: "Did you really think the other's were true?"
    },
    {
        id: 14,
        question: "What is the name of a real ocean?",
        answers: {
            A: "Pacific ocean",
            B: "Specific ocean",
            C: "Pacific Standard Ocean"
        },
        correctAnswer: "A",
        reasoning: "I got pretty specific didn't I?"
    },
    {
        id: 15,
        question: "What are you chances of winning the lottery?",
        answers: {
            A: "45%",
            B: "1 in 100000",
            C: "You can't"
        },
        correctAnswer: "C",
        reasoning: "A bit cynical."
    },
    {
        id: 16,
        question: "Use the force ____?",
        answers: {
            A: "Luke",
            B: "Chewie",
            C: "You fool!"
        },
        correctAnswer: "A",
        reasoning: "Watch a movie."
    },
    {
        id: 17,
        question: "Where would you find the answer to this question?",
        answers: {
            A: "Here",
            B: "Google it",
            C: "Guess"
        },
        correctAnswer: "D",
        reasoning: "You're tactic is as good as mine."
    },
    {
        id: 18,
        question: "Is this question different from the others?",
        answers: {
            A: "Yes",
            B: "No",
            C: "I wasn't paying attention"
        },
        correctAnswer: "A",
        reasoning: "It should be."
    },
    {
        id: 19,
        question: "How many fingers am I holding up?",
        answers: {
            A: "You don't even have hands",
            B: "All of them",
            C: "Just one"
        },
        correctAnswer: "C",
        reasoning: "Can you guess which one?"
    },
    {
        id: 20,
        question: "What happens when you sleep?",
        answers: {
            A: "Everyone hides",
            B: "You dream",
            C: "They cover your eyes"
        },
        correctAnswer: "B",
        reasoning: "If you picked the others, my friends in black want to talk with you."
    },
    {
        id: 21,
        question: "What was Chicken Little afraid of?",
        answers: {
            A: "The sky falling down",
            B: "Thanksgiving",
            C: "Rotten eggs"
        },
        correctAnswer: "A",
        reasoning: "Read a book."
    },
    {
        id: 22,
        question: "What is your pin number?",
        answers: {
            A: "1234",
            B: "password1",
            C: "Can't catch me!"
        },
        correctAnswer: "C",
        reasoning: "If you picked the others, I'm stealing your money."
    },
    {
        id: 23,
        question: "How do all Australians get around?",
        answers: {
            A: "A car dummy",
            B: "Kangaroos",
            C: "Walking"
        },
        correctAnswer: "B",
        reasoning: "It is 100% true."
    },
    {
        id: 24,
        question: "Why am I a bad coder?",
        answers: {
            A: "Don't answer that",
            B: "Bad teaching",
            C: "Bad learner"
        },
        correctAnswer: "A",
        reasoning: "Please don't."
    },
    {
        id: 25,
        question: "Why is the quiz taking so long?",
        answers: {
            A: "Time is funny here",
            B: "Do you really wanna know?",
            C: "It's endless"
        },
        correctAnswer: "B",
        reasoning: "Do you?"
    }
];

//This is the function to bgein build/setup of the quiz
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
                `<label>
                        <input type="radio" name="question${ii}" value="${letter}">
                            ${letter} :
                            ${currentQuestion.answers[letter]}
                     </label>`
                );
        }

        //Add the built question to the output
        output.push
            (
            `<div class="question"> ${currentQuestion.question} </div>
                 <div class="answers"> ${answers.join('')} </div>
                 <div class="reasoning"> <p> ${currentQuestion.reasoning} <br /> </p> </div>`
            );

    }

    //Put the finished questions back on the page
    quizContainer.innerHTML = output.join("");
}

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

//This is the function for showing the results
function showResults()
{
    //Get all answers the user selected in the quiz from the page
    const answerContainers = quizContainer.querySelectorAll(".answers");

    //Have a variable to track the number of questions the user got correct
    let numCorrect = 0;

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
            //Increase total
            numCorrect++;

            //Colour the answer green (for when user see the quiz after)
            answerContainers[ii].style.color = "lightgreen";

        }
        //If they got it wrong (including no answer)
        else
        {
            //Colour it red
            answerContainers[ii].style.color = "red";
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

}

//Function to allow the go back button to take you to the quiz main page
function goBack()
{
    window.location.assign("../quizStart.html"); 
}

//Go to what we set the continueHref value to - depending on pass results
function goForward()
{
    window.location.assign(continueHref);
}

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