// This is the javascript file for building, handling and displaying the chapter quizzes
// Each quiz .html page will import identifiers to which chapter they are for - allowing the database to return chapter unique questions
// The rest of the code is the same for each quiz - which is why we do not need more than one file

//All code/implementation was adapted/learned from the tutorial on JavaScript Quiz at https://www.sitepoint.com/simple-javascript-quiz/

//Thes are the ID variables we will use to access the html objects in the provided .html document
const quizContainer = document.getElementById('quiz');
const resultsContainer = document.getElementById('results');
const submitButton = document.getElementById('submit');

//A initial client side based set of questions - REMOVE BEFORE RELEASE -> REPLACE WITH DATABASE RETRIEVAL
const myQuestions = [
    {
        question: "Who is the strongest?",
        answers: {
            a: "Superman",
            b: "The Terminator",
            c: "Waluigi, obviously"
        },
        correctAnswer: "c"
    },
    {
        question: "What is the best site ever created?",
        answers: {
            a: "SitePoint",
            b: "Simple Steps Code",
            c: "Trick question; they're both the best"
        },
        correctAnswer: "c"
    },
    {
        question: "Where is Waldo really?",
        answers: {
            a: "Antarctica",
            b: "Exploring the Pacific Ocean",
            c: "Sitting in a tree",
            d: "Minding his own business, so stop asking"
        },
        correctAnswer: "d"
    }
];

//This is the fucntion to bgein build/setup of the quiz
function buildQuiz()
{

}

//This is the function for showing the results
function showResults()
{

}

//We need to build the quiz first
buildQuiz();

//Once the user clicks submit - show them their results
submitButton.addEventListener('click', showResults);
