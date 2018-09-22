/* AUTHOR INFORMATION
 * CREATOR - Ethan Bell 08/09/2018 (Originl Code), Jeremy Dunnet 22/09/2018 (This file)
 * LAST MODIFIED BY - Jeremy Dunnet 22/09/2018 
 */

/* CLASS/FILE DESCRIPTION
 * This javascript file handles the sanitisation of user input for a variety of actions a user on a website may have to provide input for.
 * This protects the website from malicious and also helps user's who make mistakes to not fail in their inputs (if they accidentely typed a bad character)
 */

/* VERSION HISTORY
 * 22/09/2018 - Created file, adapted code and integrated into program
 */

/* REFERENCES
 * The original code was adapted from project team member Ethan Bell's feature design (/previousFiles/sanitisation/* to integrate into the current program as a whole
 * And many tutorials/documentation from https://www.w3schools.com 
 */

/* FUNCTION INFORMATION
 * NAME - sanitiseSearch
 * INPUTS - inTxt (The original user input)
 * OUTPUTS - outTxt (the sanitised input)
 * PURPOSE - This function takes in a an input string (from any search bar text box) and removes all unwanted characters (anything that is not a number/A-Z)
 *           and then returns it to the function that called it
 */
function sanitiseSearch(inTxt)
{
    var outTxt, maxLen;
    maxLen = 26; //Tjis is based on the longest (CURRENTLY) available search tag + 3 for different word choice

    //regex to remove all non alphanumeric or whitespace characters
    outTxt = inTxt.replace(/[^0-9a-zA-Z ]/g, "");

    //only accept strings less than maxLen characters
    if (outTxt.length > maxLen)
    {
        outTxt = outTxt.slice(0, maxLen);
    }

    //Add new sanitise rules here if necessary in future

    //CONSIDER
    //This function can also do the searching of the document if thought more secure to not have the sanitised input move around before use

    return outTxt;
}

/* FUNCTION INFORMATION
 * NAME - sanitiseWebStorage
 * INPUTS - inKey (key used to get storage item)
 * OUTPUTS - outRef (sanitised object)
 * PURPOSE - This takes in a key refernce to get something out of web storage - we then chjeck what comes out and sanitise in case
 *           an attacker managed to get malicious data into the storage and is trying to use it
 */
function sanitiseWebStorage(inKey)
{
    var inRef, outRef, maxLen;
    maxLen = 12; //Set length to length of largest key +  a couple for spacing

    //CONSIDER
    //You may use the above sanitise function to sanitise the inKey value to ensure not malicious
    //You may also want to have a switch/loop to check for illegal object values - prevent users from accessing privileged objects

    inRef = localStorage.getItem(inKey); //Find the item associated with the key

    //regex to remove all non alphanumeric or whitespace characters
    outRef = inRef.replace(/[^0-9a-zA-Z ]/g, "");

    //only accept up to maxLen characters
    if (outRef.length > maxLen)
    {
        outRef = outRef.slice(0, maxLen);
    }

    //Add new sanitise rules here if necessary in future

    return outRef;
}