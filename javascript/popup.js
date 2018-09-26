/* AUTHOR INFORMATION
 * CREATOR - Oliver Yeudall 26/09/2018 (Originl Code), Jeremy Dunnet 26/09/2018 (This file)
 * LAST MODIFIED BY - Jeremy Dunnet 26/09/2018 
 */

/* CLASS/FILE DESCRIPTION
 * This file handles the display of defintions as tooltips under highlighted terms in a chapters text - allowing a user to know what the term means
 */

/* VERSION HISTORY
 * 26/09/2018 - Created file, adapted code and integrated into program
 */

/* REFERENCES
 * The original code was adapted from project team member Oliver Yeudall's feature design (/previousFiles/popups.html) to integrate into the current program as a whole
 * And many tutorials/documentation from https://www.w3schools.com 
 */
var definitionList; //The number of definitions in the json file
// JSON file and error handling based off of Jeremy's work in the quiz.js
/* AUTHOR INFORMATION
 * CREATOR - Oliver Yeudall 26/09/2018
 * LAST MODIFIED BY - Jeremy Dunnet 26/09/2018
 * 
 * CLASS/FILE DESCRIPTION
 * The JSON acts as a mock database - which can be filled with arrays pertaining to the pool of definitions available for that chapter
 * The JSON file is also parsed directly into a javascript object so it can be used easily
 * 
 * VERSION HISTORY
 * 26/09/2018 - Created and updated to integrate into program
 * 
 * REFERENCES
 * All tutorials on setup and design of simple JSON files was adapted/learned from https://www.w3schools.com
 * How to encode html tags into JSON learned from https://www.thorntech.com/2012/07/4-things-you-must-do-when-putting-html-in-json/
 * 
 */
const defsJSONFile = "/json/definitions.json";

const definitionsBugScreen =
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






/* FUNCTION INFORMATION
* NAME - loadDefinitions
* INPUTS - response
* OUTPUTS - none
* PURPOSE - This is the method that parses a JSON file which contains definitions
* ORIGINAL AUTHOR - Jeremy Dunnet
* MODIFIED BY - Oliver Yeudall
*/

function parseDefinitions(response)
{
    //Take a JSON file - parse it into the array for use later
    definitionList = JSON.parse(response);

    addPopupDesc();

}

/* FUNCTION INFORMATION
 * NAME - loadDefinitionsJSON
 * INPUTS - none
 * OUTPUTS - none
 * PURPOSE - This is the method that loads the definitions from a
 *           JSON file
 * ORIGINAL AUTHOR - Jeremy Dunnet
 * MODIFIED BY - Oliver Yeudall
 */
function loadDefinitionsJSON()
{

    var xobj = new XMLHttpRequest(); //Create a request object to get the data from the JSON File
    xobj.overrideMimeType("application/json"); //Overide the deafult file type it is looking for to JSON
    xobj.open("GET", defsJSONFile, true); //Give the name of our file (it is located locally) and tell it to load asynchronously
    //(while the rest of the code cannot function until code is loaded - sychronous requests are deprecated according to https://xhr.spec.whatwg.org/#the-open()-method)
    //We use GET as while POST more secure, GET is the only guaranteed method to work in all browsers
    //in current build - REVIEW WHEN MOVED TO FULL LIVE TESTING
    xobj.onreadystatechange = function () //What event listener activates when the task is done
    {
        if (xobj.readyState == 4 /*&& xobj.status == "200" I have removed this check now since the status will not change on local tests - RE-ENABLE ON LIVE TESTS*/) //If the the request is DONE(readyState) and OK(status)
        {
            parseDefinitions(xobj.responseText);
        }
    };
    xobj.send(null); //Send a null to the request to complete the transaction
}


/* FUNCTION INFORMATION
* NAME - loadDefinitions
* INPUTS - none
* OUTPUTS - none
* PURPOSE - This is the method that attempts to load the definitions
*           handles any errors
* ORIGINAL AUTHOR - Jeremy Dunnet
* MODIFIED BY - Oliver Yeudall
*/

function loadDefinitions()
{

    try
    {
        //We start but requesting the JSON to retrieve the question list
        loadDefinitionsJSON();
    }
    catch (bug) //It's a joke. I do that.
    {
        //These exceptions are kept somwhat vague to decrease client knoweledge of page code (for security)
        if (bug instanceof SyntaxError) //JSON parsing error
        {
            document.body.innerHTML = definitionsBugScreen + "<p>Problem parsing JSON input</p>";
        }
        /* I have commeneted this out becuase the browsers I have tested on report this exception type as not found - is only valid for some browser support
        else if (bug instanceof InvalidStateError) //XMLHTTPRequest retrieval error
        {
            document.body.innerHTML = definitionsBugScreen + "<p>Problem retrieving data from questions database</p>";
        }
        */
        else if (bug instanceof RangeError) //An array/list went out of bounds
        {
            document.body.innerHTML = definitionsBugScreen + "<p>You're out of bounds - here be dragons</p>";
        }
        else if (bug instanceof TypeError) //A variable had a bad type/object function syntax used on it
        {
            document.body.innerHTML = definitionsBugScreen + "<p>A resource was thought to be a type different to what it actually was (Scandalous :O)</p>";
        }
        else if (bug instanceof ReferenceError) //A object was derefenced badly
        {
            document.body.innerHTML = definitionsBugScreen + "<p>Problem accessing webpage resources</p>";
        }
        else if (bug instanceof InternalError) //Javascript engine error
        {
            document.body.innerHTML = definitionsBugScreen + "<p>Problem with javascript engine</p>";
        }
        //I do not catch URI/Eval Errors specifically since I do not use their respective functions in this code
        //Everything else goes to an unknown error
        else
        {
            document.body.innerHTML = definitionsBugScreen + "<p>An unknown error occured</p>";
        }
    }
}

/**************************************************************************
*  Function: addPopupDesc                                                 *
*  Purpose: Finds all popup objects and modifies their title              *
*           attribute properly                                            *
*  IMPORT: none                                                           *
*  EXPORT: none                                                           *
*  ***********************************************************************/

function addPopupDesc()
{
    var popup;
    for (var ii = 0; ii < (definitionList.popUpTerms).length; ii++)
    {

        popup = document.getElementById(definitionList.popUpTerms[ii].id);
        if (popup !== null) //There was a valid popup on the page
        {
            popup.title = definitionList.popUpTerms[ii].definition;
        }

    }

}