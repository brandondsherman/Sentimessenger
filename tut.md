# How to get your facebook data

* Go to facebook.com
* Click on the picture of lock at the top right
	* ![The topright of Facebook](/images/topRight.png)
* You'll see this:
	* ![Privacy Shortcuts](/images/privacyShortcuts.png)
* Click on the "See More Settings" link
* You'll start on the Privacy tab
* You need to switch to the General tab
	* [!Privacy Tab](/images/privacyTab.png)
	* [!General Tab](/images/generalTab.png)
* Click on the link to "Download a copy" 
* Then click on the green button "Start My Archive"
* You'll be prombted for you fb password
* After successfully putting in your password it has another popup to confirm the download. Click on "Start My Archive"
* They will email you your download is ready. This could take a while.
* The email will have a link that once clicked will begin your download.
* Upload the file /html/messages.htm







# Explanations of our stack

[This is all on github. Click here if you need help with git](git.txt)

The scraping of the html was done with Python using the Beautiful Soup library.

Natural Language Processing was done with R using the syuzhet package. R was used inside of Python code using rpy2.

The JSON of the scraped and processed messenger data was requested and sent by the Python library Flask.

The front end was made HTML, CSS, Javascript, and more specifically Angular JS.

The back end was made with node.js

Styling and humor was ripped off from [XKCD](http://www.xkcd.com)
