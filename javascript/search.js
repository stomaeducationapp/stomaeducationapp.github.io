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
*  Function: searchFilter                                                 *
*  Purpose: Enable the display of the current items in the search list    *
*  IMPORT: none                                                           *
*  EXPORT: none                                                           *
*  ***********************************************************************/

function searchFilter(matches)
{
    var ddButtPos = 0;
    var ddContentPos = 1;

    results = document.getElementById("searchList");
    results.innerHTML = matches.join("");

    items = document.getElementsByClassName("searchItem");
    for (ii = 0; ii < items.length; ii++)
    {

        items[ii].addEventListener('click', function ()
        {

            relatedID = this.dataset.targetId;
            relatedAnchor = document.getElementById(relatedID);

            parentID = relatedAnchor.dataset.parentId;
            parentAnchor = document.getElementsByClassName(parentID);

            if ((parentAnchor[ddContentPos].style.display) === "block") //If the dropdown is already displayed
            {
                //Don't close the dropdown
            }
            else
            {
                parentAnchor[ddButtPos].click();
            }

            relatedAnchor.click();

            searchFilterBlur(); //Clear the search overlay from screen
        });

    }

    document.querySelector("#searchList").style.display = "block";
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
    var searchValues = [];
    var matches = []; //An empty array of found matches

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
    div = document.getElementById("sideNav");

    //Since we use anchor tags to store the chapter tabs - we can strip out all uneeded HTML tags so our loop is as short as possible
    a = div.getElementsByTagName("a");

    var foundMatch = false;
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

            //Get all the search tags within this anchor
            tagList = (a[ii].dataset.searchTags).toUpperCase();

            for (jj = 0; jj < searchValues.length; jj++)
            {

                //If the list of tags contains the search value
                if ( tagList.includes(searchValues[jj]) )
                {
                    if (currentMatch)
                    {
                        //If we already found this anchor during the loop - don't add it again
                    }
                    else //If this is the first time this anchor matched our search
                    {
                        foundMatch = true;
                        currentMatch = true; //Say we found one for the current anchor 

                        //Assemble all the needed values from our found match
                        //ID
                        termID = a[ii].id;
                        //Innertext (minus any bookmarks so it looks clean)
                        resultText = (a[ii].innerText).replace(/[…✔!⋆]/g, "");

                        //Create a div to contain our result - allows easier styling
                        //The div contains the acnhor we will use in searchFilter to load the chapter provided
                        result = '<div class="searchResult"> <a class="searchItem" data-target-id="' + termID + '">' + resultText + '</a> </div>';

                        matches.push(result); //Add found tag to list of matches
                    }


                }

            }

            currentMatch = false; //Since we have finished with the current anchor - reset matching for the next one

        }
    }

    //A match was found - display all the items found, otherwise show an empty box
    if (foundMatch)
    {
        searchFilter(matches);
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