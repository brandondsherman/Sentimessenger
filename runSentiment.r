library(syuzhet)
string <- commandArgs(trailingOnly = TRUE)
cat(get_nrc_sentiment(string))