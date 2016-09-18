from bs4 import BeautifulSoup
import lxml
import json

def getHTMLFromFrontEnd(html):
	allSoup = BeautifulSoup(soup,"lxml")
	return(parseAllThreadsSoup(allSoup))



def parseOneMessageSoup(messageSoup, actualMessageSoup):
    message = {}
    message["User"] = messageSoup.find_all("span", class_ = "user")[0].get_text()
    message["Message"] = actualMessageSoup.get_text()
    message["Date"] = messageSoup.find_all("span", class_ = "meta")[0].get_text()
    #print(message)
    return(message)

def parseOneThreadSoup(threadSoup):
    allMessagesList = threadSoup.find_all("div", class_ = "message")
    actualMessages = threadSoup.find_all("p")
    if(len(allMessagesList) == len(actualMessages)):
        parsedThread = {}
        threadAsString = str(threadSoup)
        firstRightBracket = threadAsString.find(">",1)
        firstLeftBracket = threadAsString.find("<",1)
        members = threadAsString[firstRightBracket+1:firstLeftBracket]
        parsedThread["Members"] = members.split(", ")
        parsedMessages = []
        for i in range(0,len(allMessagesList)):
            parsedMessages.append(parseOneMessageSoup(allMessagesList[i],actualMessages[i]))
        parsedThread["Messages"] = parsedMessages
        #print(parsedThread)
        return(parsedThread)
    else:
        print("The number of p blocks didnt match number of messages")
        return(None)

def parseAllThreadsSoup(allThreads):
    allThreadsList = allThreads.find_all("div", class_ = "thread")
    parsedThreads = []
    for threadSoup in allThreadsList:
        parsedThreads.append(parseOneThreadSoup(threadSoup))
    return(parsedThreads)