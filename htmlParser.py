from bs4 import BeautifulSoup
import lxml
import json
import rpy2.robjects as robj
import os
from flask import Flask, request, redirect, url_for, jsonify
from flask_cors import CORS, cross_origin
from werkzeug import secure_filename




def setUpSentiment():
	robj.r('''
	getSenti <- function(string, sentiment){
		library(syuzhet)
		as.vector(get_nrc_sentiment(string)[1,])
	}
	'''	
	)
	return(robj.r("getSenti"))
doSenti = setUpSentiment()


def startParsing(htmlFile):
	allSoup = BeautifulSoup(open(htmlFile),"lxml")
	print("in here with" + htmlFile)
	return(parseAllThreadsSoup(allSoup))
	

def parseOneMessageSoup(messageSoup, actualMessageSoup):
    message = {}
    message["User"] = messageSoup.find_all("span", class_ = "user")[0].get_text()
    message["Message"] = actualMessageSoup.get_text()
    rawDate = messageSoup.find_all("span", class_ = "meta")[0].get_text()
    message["Date"] = rawDate
    dateInfo = rawDate.replace(",", "").split(" ")
    message["Month"] = dateInfo[1]
    message["Day"] = dateInfo[2]
    message["Year"] = dateInfo[3]
    calcedSentiments = doSenti(message["Message"])
    sentiments = {}
    sentiments["anger"] = tuple(calcedSentiments.rx2(1))[0]
    sentiments["anticipation"] = tuple(calcedSentiments.rx2(2))[0]
    sentiments["disgust"] = tuple(calcedSentiments.rx2(3))[0]
    sentiments["fear"] = tuple(calcedSentiments.rx2(4))[0]
    sentiments["joy"] = tuple(calcedSentiments.rx2(5))[0]
    sentiments["sadness"] = tuple(calcedSentiments.rx2(6))[0]
    sentiments["surprise"] = tuple(calcedSentiments.rx2(7))[0]
    sentiments["trust"] = tuple(calcedSentiments.rx2(8))[0]
    sentiments["negative"] = tuple(calcedSentiments.rx2(9))[0]
    sentiments["positive"] = tuple(calcedSentiments.rx2(10))[0]
    message["Sentiments"] = sentiments
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

  
    

#________________________flask stuff here


UPLOAD_FOLDER = '/tmp/'
ALLOWED_EXTENTIONS = set(['txt','htm', 'html'])
app = Flask(__name__)
CORS(app)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def allowed_file(filename):
	return '.' in filename and \
		filename.rsplit('.',1)[1] in ALLOWED_EXTENTIONS

@app.route("/", methods = ['GET', 'POST'])
def index():
	if request.method == 'POST':
		file = request.files['file']
		if file and allowed_file(file.filename):
			filename = secure_filename(file.filename)
			file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
			rtnDict = startParsing("/tmp/"+filename)
			os.remove("/tmp/"+filename)
			return(json.dumps(rtnDict))
	return ""


if __name__ == "__main__":
	app.run(host='0.0.0.0', port=5001, debug=True)

