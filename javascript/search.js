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
 * And many tutorials/documentation from https://www.w3schools.com 
 */


/**************************************************************************
*  Function: Event listener click event                                   *
*  Purpose: Detect the location of clicks relative to the search bar and  *
*           search items                                                  *
*  IMPORT: none                                                           *
*  EXPORT: none                                                           *
*  ***********************************************************************/
/*document.addEventListener("click", function (evt)
{
    var flyoutElement = document.getElementById("dropdownUI");
    var clickFlag = false;
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
}); */


/**************************************************************************
*  Function: searchFilter                                                 *
*  Purpose: Enable the display of the current items in the search list    *
*  IMPORT: none                                                           *
*  EXPORT: none                                                           *
*  ***********************************************************************/

function searchFilter(matches)
{
    results = document.getElementById("searchList");
    results.innerHTML = matches.join("");

    items = document.getElementsByClassName("searchItem");
    for (ii = 0; ii < items.length; ii++)
    {

        items[ii].addEventListener('click', function ()
        {
            relatedID = this.dataset.targetId;
            relatedAnchor = document.getElementById(relatedID);
            relatedAnchor.click();
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
    document.querySelector("#dropDownList").style.display = "none";
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
    var searchValue = "";
    var matches = []; //An empty array of found matches

    //Get the box with the user's input
    rawUserInput = document.getElementById("searchBar");

    //Get input text, sanitise and convert to upper case - IN CURRENT IMPLEMENTATION CASE DOES NOT ALTER RESULTS
    searchValue = String(sanitiseSearch(rawUserInput.value)).trim().toUpperCase();
    //CONSIDER
    //Just obtaining the value if there is a difference between terms with case variance (proper names, acronyms etc.)

    //Get the area the user is searching (each chapter tab has search terms applied based on if the subject is covered there)
    //This is what the user is looking for
    div = document.getElementById("sideNav");

    //Since we use anchor tags to store the chapter tabs - we can strip out all uneeded HTML tags so our loop is as short as possible
    a = div.getElementsByTagName("a");

    var foundMatch = false;

    //Loop through all found elements
    for (var ii = 0; ii < a.length; ii++)
    {
        //If the tag contains the input in the search bar
        if (String(a[ii].innerHTML).trim().toUpperCase().indexOf(searchValue) > -1)
        {
            //a[ii].style.display = ""; //Remove any existing display values (hidden/none) so that it is visible

            foundMatch = true;

            //Assemble all the needed values from our found match
            //ID
            termID = a[ii].id;
            //Innertext (minus any bookmarks so it looks clean)
            resultText = (a[ii].innerText).replace("/…|✔|!|⋆/g", "");

            //Create a div to contain our result - allows easier styling
            //The div contains the acnhor we will use in searchFilter to load the chapter provided
            result = '<div class="searchResult"> <a class="searchItem" data-target-id="' + termID + '">' + resultText + '</a>';

            matches.push(result); //Add found tag to list of matches
        }
        else
        {
            //a[ii].style.display = "none"; //Hide this element from search results
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