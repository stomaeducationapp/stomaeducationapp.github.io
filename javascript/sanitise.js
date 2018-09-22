// JavaScript source code


/* These functions allow sanitising input text and HTML web storage via the key. */

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

/* This function may be able to be combined with the function above, depending on the implementation of the web storage.
 * If the caller reads the text and passes it, the function above can be used. If the caller passes the key, this function will be used. */
function sanitiseWebStorage(inKey)
{
    var inRef, outRef, maxLen;
    maxLen = 12;

    inRef = localStorage.getItem(inKey);

    //regex to remove all non alphanumeric or whitespace characters
    outRef = inRef.replace(/[^0-9a-zA-Z ]/g, "");

    //only accept up to maxLen characters
    if (outRef.length > maxLen)
    {
        outRef = outRef.slice(0, maxLen);
    }

    //
    //Add new rules here if necessary in future
    //

    return outRef;
}