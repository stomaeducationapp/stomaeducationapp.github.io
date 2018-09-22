// JavaScript source code


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
*  IMPORT: none                                                           *
*  EXPORT: none                                                           *
*  ***********************************************************************/

function searchFilter()
{
    document.querySelector("#dropDownList").style.display = "block";
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
    /* Based on example from www.w3schools.com/howto/howto_js_filterdropdown.asp */

    var rawUserInput, div, a;

    var searchValue = "";

    rawUserInput = document.getElementById("inputBox");

    console.log(rawUserInput.value);

    searchValue = String(sanitiseSearch(rawUserInput.value)).trim().toUpperCase();

    console.log(searchValue);

    div = document.getElementById("dropDownList");

    a = div.getElementsByTagName("a");

    var foundMatch = false;

    for (var i = 0; i < a.length; i++)
    {
        if (String(a[i].innerHTML).trim().toUpperCase().indexOf(searchValue) > -1)
        {
            a[i].style.display = "";
            foundMatch = true;
        }
        else
        {
            a[i].style.display = "none";
        }

    }

    if (foundMatch)
    {
        searchFilter();
    } else
    {
        searchFilterBlur();
    }

}

window.addEventListener('load', function ()
{
    document.getElementById('inputBox').addEventListener("keyup", displayFilter);
});


/**************************************************************************
*  Function: sanitiseSearch                                               *
*  Purpose: Sanitize user input for non alphanumeric characters,          *
*           whitespace characters and length                              *
*  IMPORT: inTxt                                                          *
*  EXPORT: outTxt                                                         *
*  AUTHOR: Ethan Bell                                                     *
*  DATE MODIFIED: 20/09/2018                                              *
*  ***********************************************************************/

/* This function sanitises user input via an imported string and returns the sanitised input */
function sanitiseSearch(inTxt)
{
    var outTxt, maxLen;
    maxLen = 12;

    //regex to remove all non alphanumeric or whitespace characters
    outTxt = inTxt.replace(/[^0-9a-zA-Z ]/g, "");

    //only accept strings less than maxLen characters
    if (outTxt.length > maxLen)
    {
        outTxt = outTxt.slice(0, maxLen);
    }

    //
    //Add new rules here if necessary in future
    //

    return outTxt;
}