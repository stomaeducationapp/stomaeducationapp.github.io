/* AUTHOR INFORMATION
 * CREATOR - Jeremy Dunnet 03/09/2018
 * LAST MODIFIED BY - Jeremy Dunnet 22/10/2018
 * 
 * CLASS/FILE DESCRIPTION
 * This file is design to identify and test the browser software and version being used by the client to view a web page in the app.
 * If the user is using an unsupported browser (Listed below as per our SRS) they are taken to a custom error page detailing what happened
 * and what they should do to fix it.
 * Supported browsers:
 *  Chrome (Version 68 and above)
 *  Firefox (Version 61 and above)
 *  Edge (Version 17 and above)
 *  Opera (Version 55 and above)
 *  Safari/iOS (Version 6 and above)
 * 
 * VERSION HISTORY
 * 03/09/2018 - Created and refined design for use in all html pages in this app
 * 22/10/2018 - Added Safari check code
 * 
 * REFERENCES
 * This design/implementation was adapted from https://stackoverflow.com/questions/11219582/how-to-detect-my-browser-version-and-operating-system-using-javascript
 *  (All useful comments from the above reference are marked with a #)
 * All bowser version support apart from Safari were taken from browser tests with current available browser versions, the Safari version number was sourced from
 * https://everyi.com/by-capability/maximum-supported-ios-version-for-ipod-iphone-ipad.html and https://en.wikipedia.org/wiki/IPad#Model_comparison (this website was designed to work on iPads so that is browser with the most support)
 */

//PLEASE NOTE - THIS IS A BEST-CAN-DO FIX, IF YOU CAN DESIGN A MORE ELEGANT AND PRECISE WAY PLEASE DO!

function browserTest()
{
    var nAgt = navigator.userAgent;
    var browserName = navigator.appName;
    var fullVersion = "" + parseFloat(navigator.appVersion);
    var majorVersion = parseInt(navigator.appVersion, 10);
    var nameOffset, verOffset, ix;

    //# In Opera, the true version is after "Opera" or after "Version"
    if ((verOffset = nAgt.indexOf("OPR")) != -1) //Edited to OPR since Opera has since changed it's tags in the navigator
    {
        browserName = "Opera";
        fullVersion = nAgt.substring(verOffset + 4);
    }
    // In Edge, the true version is after "Edge" in userAgent (added by me since reference was published before edge)
    else if ((verOffset = nAgt.indexOf("Edge")) != -1)
    {
        browserName = "Edge";
        fullVersion = nAgt.substring(verOffset + 5);
    }
    //# In Chrome, the true version is after "Chrome" 
    else if ((verOffset = nAgt.indexOf("Chrome")) != -1)
    {
        browserName = "Chrome";
        fullVersion = nAgt.substring(verOffset + 7);
    }
    //# In Safari, the true version is after "Safari" or after "Version" 
    else if ((verOffset = nAgt.indexOf("Safari")) != -1)
    {
        browserName = "Safari";
        fullVersion = nAgt.substring(verOffset + 7);
        if ((verOffset = nAgt.indexOf("Version")) != -1)
            fullVersion = nAgt.substring(verOffset + 8);
    }
    //# In Firefox, the true version is after "Firefox" 
    else if ((verOffset = nAgt.indexOf("Firefox")) != -1)
    {
        browserName = "Firefox";
        fullVersion = nAgt.substring(verOffset + 8);
    }
    //# In most other browsers, "name/version" is at the end of userAgent 
    else if ((nameOffset = nAgt.lastIndexOf(" ") + 1) <
        (verOffset = nAgt.lastIndexOf("/"))) 
    {
        browserName = nAgt.substring(nameOffset, verOffset);
        fullVersion = nAgt.substring(verOffset + 1);
        if (browserName.toLowerCase() == browserName.toUpperCase())
        {
            browserName = navigator.appName;
        }
    }
    //# trim the fullVersion string at semicolon/space if present
    if ((ix = fullVersion.indexOf(";")) != -1)
        fullVersion = fullVersion.substring(0, ix);
    if ((ix = fullVersion.indexOf(" ")) != -1)
        fullVersion = fullVersion.substring(0, ix);

    majorVersion = parseInt("" + fullVersion, 10);
    if (isNaN(majorVersion))
    {
        fullVersion = "" + parseFloat(navigator.appVersion);
        majorVersion = parseInt(navigator.appVersion, 10);
    }


    //Now we check to see if the client's broswer matches one we support (added by me to original deisgn - theirs simply published info to the screen)
    if ((browserName === "Chrome") && (majorVersion >= 68))
    {
        browserSupport = true; //Since this is one we support - we don't need to error out
    }
    else if ((browserName === "Firefox") && (majorVersion >= 61))
    {
        browserSupport = true;
    }
    else if ((browserName === "Edge") && (majorVersion >= 17))
    {
        browserSupport = true;
    }
    else if ((browserName === "Opera") && (majorVersion >= 55))
    {
        browserSupport = true;
    }
    else if ((browserName === "Safari") && (majorVersion >= 6)) //This will work with every iPad apart from gen 1 currently
    {
        browserSupport = true;
    }
    else
    {
        browserSupport = false; //If not one of the supported - mark so that below control statement handles it
    }

    if (browserSupport === false)
    {
        document.location.href = "/globalErrorPages/browserError.html"; //Go to our custom error page
    }
}

browserTest();
