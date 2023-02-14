import sys
import cv2
import math
import subprocess

testImage = cv2.imread("target_print.png")

grayImage = cv2.cvtColor(testImage, cv2.COLOR_BGR2GRAY)

returnImage, grayImage = cv2.threshold(grayImage, 245,255,cv2.THRESH_BINARY)
(contour,_) = cv2.findContours(grayImage, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

cv2.namedWindow("Result", 1)
cv2.imshow("Result", testImage)

while 1:
    if cv2.waitKey(1) >= 0:
        break