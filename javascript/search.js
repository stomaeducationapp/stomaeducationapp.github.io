/* AUTHOR INFORMATION
 * CREATOR - Oliver Yeudall 20/09/2018 (Original Code), Jeremy Dunnet 22/09/2018 (This file)
 * LAST MODIFIED BY - Jeremy Dunnet 22/09/2018 
 */

/* CLASS/FILE DESCRIPTION
 * This javascript file handles the functionality of searching the page (particularly the chapter dropdown side bar CURRENTLY) for
 * for specific tags. This allows a user to find chapters with information they want more quickly. It also contains functionailty to 
 * control how the search bar displays itself.
 */

/* VERSION HISTORY
 * 22/09/2018 - Created file, adapted code and integrated into program
 */

/* REFERENCES
 * All code was adapted from team member Oliver Yeudall's feature design (/previousFiles/searchbar.html) to integrate into the current program as a whole
 * Detecting click events relative to search bar learned from http://blustemy.io/detecting-a-click-outside-an-element-in-javascript/
 * Altering display based on key press learned from http://www.w3schools.com/howto/howto_js_filterdropdown.asp
 * Dynamic array expanding learned from https://www.w3schools.com/jsref/jsref_push.asp
 * Replace regex learned from https://stackoverflow.com/questions/16576983/replace-multiple-characters-in-one-replace-call
 * Triggering click events from code learned from https://stackoverflow.com/questions/14156327/how-to-call-a-code-behinds-button-click-event-using-javascript
 * Using data-* attritube learned from https://developer.mozilla.org/en-US/docs/Learn/HTML/Howto/Use_data_attributes
 * Passing into an event the tags info learned from https://stackoverflow.com/questions/20868907/javascript-get-element-id-from-event
 * Indexof learned from https://www.w3schools.com/jsref/jsref_indexof.asp
 * And many tutorials/documentation from https://www.w3schools.com 
 */

/**************************************************************************
*  Function: Event listener click event                                   *
*  Purpose: Detect the location of clicks relative to the search bar and  *
*           search items                                                  *
*  IMPORT: none                                                           *
*  EXPORT: none                                                           *
*  ***********************************************************************/
//Based on example from http://blustemy.io/detecting-a-click-outside-an-element-in-javascript/
document.addEventListener("click", function (evt)
{
    var flyoutElement = document.getElementById("dropdownUI");
    var clickFlag = false;
    //let targetElement = evt.target;
    var targetElement = evt.target;

    do
    {
        if (targetElement == flyoutElement)
        {
            // A click has been made in the search bar and associated items
            clickFlag = true;

        }

        targetElement = targetElement.parentNode;
    } while (targetElement);

    if (clickFlag)
    {
        // Show search items
        searchFilter();
    }
    else
    {
        // Hide search items
        searchFilterBlur();
    }

    clickFlag = false;

    return;
});

/**************************************************************************
*  Function: searchFilter                                                 *
*  Purpose: Enable the display of the current items in the search list    *
*  IMPORT: matches, defines (all the HTML elements that matched)          *
*  EXPORT: none                                                           *
*  ***********************************************************************/

function searchFilter(matches, defines)
{
    var ddButtPos = 0; //These are the positions in the array of classList for the drop down button and content
    var ddContentPos = 1; //Allows easy refactoring up here

    defineResults = document.getElementById("defineMatches"); //Get the div we are going to put all our definition matches in
    defineResults.innerHTML = defines.join(""); //Chuck in all the new elements
    termResults = document.getElementById("termMatches"); //Get the div we are going to put all our search term results in
    termResults.innerHTML = matches.join(""); //Chuck in all the new elements

    termItems = document.getElementsByClassName("searchItem"); //Go through each term match element to update listeners
    for (ii = 0; ii < termItems.length; ii++)
    {

        termItems[ii].addEventListener('click', function ()
        {

            relatedID = this.dataset.targetId; //Find the related chapter tab of the matched term
            relatedAnchor = document.getElementById(relatedID);

            parentID = relatedAnchor.dataset.parentId; //Find the parent dropdown header of the matched term
            parentAnchor = document.getElementsByClassName(parentID);

            if ((parentAnchor[ddContentPos].style.display) === "block") //If the dropdown is already displayed
            {
                //Don't close the dropdown
            }
            else
            {
                parentAnchor[ddButtPos].click(); //Open the dropdown - so user can see where they are
            }

            relatedAnchor.click(); //Load teh chapter contents the user searched for

            searchFilterBlur(); //Clear the search overlay from screen - so it doesn't block user's view of new content
        });

    }
    defineItems = document.getElementsByClassName("defineItem"); //Go through each define match element to update listeners
    for (ii = 0; ii < defineItems.length; ii++)
    {

        defineItems[ii].addEventListener('click', function ()
        {

            relatedID = this.dataset.targetId; //Find the related chapter tab of the matched term
            relatedAnchor = document.getElementById(relatedID);

            defTagID = this.dataset.defineId; //Find the anchor ID of the definition

            parentID = relatedAnchor.dataset.parentId; //Find the parent dropdown header of the matched term
            parentAnchor = document.getElementsByClassName(parentID);

            if ((parentAnchor[ddContentPos].style.display) === "block") //If the dropdown is already displayed
            {
                //Don't close the dropdown
            }
            else
            {
                parentAnchor[ddButtPos].click(); //Open the dropdown - so user can see where they are
            }

            relatedAnchor.click(); //Load the chapter contents the user searched for
            findDefinition(defTagID); //Call chapterSwitch to change window focus to anchor

            searchFilterBlur(); //Clear the search overlay from screen - so it doesn't block user's view of new content
        });

    }

    document.querySelector("#searchList").style.display = "block"; //Make sure list displays nicely
}


/**************************************************************************
*  Function: searchFilterBlur                                             *
*  Purpose: Disable and hide the current items in the search list         *
*  IMPORT: none                                                           *
*  EXPORT: none                                                           *
*  ***********************************************************************/

function searchFilterBlur()
{
    document.querySelector("#searchList").style.display = "none";
}


/**************************************************************************
*  Function: displayFilter                                                *
*  Purpose: Alter the displayed search list based on user input           *
*  IMPORT: none                                                           *
*  EXPORT: none                                                           *
*  ***********************************************************************/

function displayFilter()
{

    var rawUserInput, div, a;
    var searchValues = []; //Empty array of potential user input search terms
    var matches = []; //An empty array of found matches
    var defines = []; //An empty array of found definitions

    //Get the box with the user's input
    rawUserInput = document.getElementById("searchBar");

    //Get input text, sanitise and convert to upper case - IN CURRENT IMPLEMENTATION CASE DOES NOT ALTER RESULTS
    rawValues = (rawUserInput.value).split(" "); //Since a user could have typed multiple words - we break it up to 
    for (ii = 0; ii < rawValues.length; ii++)
    {
        sanitisedValue = (sanitiseSearch(rawValues[ii]).trim().toUpperCase()); //Sanitise each word before consider it for search
        if (sanitisedValue === "") 
        {
            //We don't want empty strings
        }
        else
        {
            searchValues.push(sanitisedValue);
        }
            
    }

    //CONSIDER
    //Just obtaining the value if there is a difference between terms with case variance (proper names, acronyms etc.)

    //Get the area the user is searching (each chapter tab has search terms applied based on if the subject is covered there)
    //This is what the user is looking for
    div = document.getElementById("sidenav");

    //Since we use anchor tags to store the chapter tabs - we can strip out all uneeded HTML tags so our loop is as short as possible
    a = div.getElementsByTagName("a");

    var foundMatch = false; //Since we are starting the search - assume we found nothing
    var currentMatch = false;

    if (searchValues.indexOf("") === 0)
    {
        //If no input (first click or deletion of previous search terms) don't show anything (index of 0 means first set)
    }
    else
    {
        //Loop through all found anchors
        for (var ii = 0; ii < a.length; ii++)
        {

            //Get all the search tags and definition tags within this anchor
            if ((a[ii].dataset.searchTags) === "") //There are no tags
            {
                tagList = null; //Set a marker so we can skip searching later
            }
            else
            {
                tagList = (a[ii].dataset.searchTags).toUpperCase();
            }
            if ((a[ii].dataset.defTags) === "") //There are no define tags
            {
                defineList = null; //Set a marker so we can skip define searching later
            }
            else
            {
                defineList = ((a[ii].dataset.defTags).toUpperCase()).split(" "); //Since we want to check each tag - split them into an array
            }

            if (tagList === null)
            {
                //Don't search this anchor
            }
            else
            {
                for (jj = 0; jj < searchValues.length; jj++)
                {

                    //If the list of tags contains the search value
                    if (tagList.includes(searchValues[jj]))
                    {

                        if (currentMatch)
                        {
                            //If we already found this anchor - don't add it again to the list of found chapters
                        }
                        else //If this is the first time this anchor matched our search or this could be a definition tag
                        {
                            if (!currentMatch) //If we haven't found a match yet
                            {
                                currentMatch = true; //Say we found one for the current anchor 
                                //Assemble all the needed values from our found match
                                //ID
                                termID = a[ii].id;
                                //Innertext (minus any bookmarks so it looks clean)
                                resultText = (a[ii].innerText).replace(/[…✔!⋆]/g, "");

                                //Create a div to contain our result - allows easier styling
                                //The div contains the acnhor we will use in searchFilter to load the chapter provided
                                matches.push(('<div class="searchResult searchItem" data-target-id="' + termID + '"> <a>' + resultText + '</a> </div>'));

                            }
                            if (defineList === null)
                            {
                                //Don't search for a define match
                            }
                            else
                            {
                                for (kk = 0; kk < defineList.length; kk++) //Now we need to check it's a define tag
                                {
                                    if (defineList[kk] === searchValues[jj]) //We used exact match (===) to find out if these strings are equal
                                    { //CONSIDER changing if you want partial matches to show a defined term
                                        //If we got a match

                                        //Assemble all the needed values from our found match
                                        //termID pf parent - so we know what chapter to open
                                        termID = a[ii].id;
                                        //defineID - since the popup tags have a naming convention we create what is should be so we can locate it later
                                        defineID = ("def" + searchValues[jj]);
                                        //Name of term - since we sanitised teh input prevously we don't need to check now
                                        resultText = searchValues[jj];

                                        //Create a div to contain our result - allows easier styling
                                        //The div contains the anchor we will use in searchFilter to load the chapter provided
                                        defines.push(('<div class="searchResult definitions defineItem" data-target-id="' + termID + '" data-define-id="' + defineID + '"> <a>' + resultText + '</a> </div>'));

                                    }
                                }

                            }

                            foundMatch = true;
                        }


                    }

                }
            }

            currentMatch = false; //Since we have finished with the current anchor - reset matching for the next one

        }
    }

    //A match was found - display all the items found, otherwise show an empty box
    if (foundMatch)
    {
        searchFilter(matches, defines);
    } else
    {
        searchFilterBlur();
    }

}

//Set up an event listener to trigger each time a user enters a single key (allows search to dynamically adjust to typed input)
window.addEventListener('load', function ()
{
    document.getElementById('searchBar').addEventListener("keyup", displayFilter);
});