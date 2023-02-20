import sys
from time import sleep
import cv2
import math
import subprocess
import numpy as np


# width = 800
# height = 640
# capture = cv2.VideoCapture(0)
# capture.set(3, width);
# capture.set(4, height);
# while 1:
#     if cv2.waitKey(1) >= 0:
#         break
#     ret,frame = capture.read()

#     grayImage = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
#     gaussian = cv2.GaussianBlur(grayImage,[3,3],0,0,cv2.BORDER_DEFAULT)
#     median = cv2.medianBlur(gaussian,3)
#     cv2.imshow("median", median)
#     circles = cv2.HoughCircles(median, cv2.HOUGH_GRADIENT, dp = 0.2, minDist = 1, param1 =300, param2 = 300, minRadius= 200, maxRadius = 0)
#     if circles is not None:
#         circles = np.uint16(np.around(circles))
#         maxCircles = [0,0,0]
#         for i in circles[0,:]:
#             if i[2] > maxCircles[2]: 
#                 maxCircles = i
#         i = maxCircles
#         cv2.circle(median,(i[0],i[1]),i[2],(0,255,0),2)
#         # draw the center of the circle
#         cv2.circle(median,(i[0],i[1]),2,(0,0,255),3)

#         cv2.namedWindow("Result", 1)
#     cv2.imshow("Result",median )

# cap = cv2.VideoCapture(0)
# # set red thresh 
# lower_red = np.array([0,0,255])
# #156, 100, 40
# upper_red = np.array([180,255,255])

# while(1):

#     if cv2.waitKey(1) & 0xFF == ord('q'):
#         break
#     ret, frame = cap.read()
#     hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)

#     # lower_red = np.array([179,50,50])
#     # upper_red = np.array([180,255,255])
#     lower_red = np.array([0,0,255])
# #156, 100, 40
#     upper_red = np.array([255,255,255])
#     mask0 = cv2.inRange(hsv, lower_red, upper_red)


#     # join my masks
#     mask = mask0
#     (minVal, maxVal, minLoc, maxLoc) = cv2.minMaxLoc(mask)

#     cv2.circle(frame, (maxLoc[0], maxLoc[1]), 20, (0, 0, 255), 2, cv2.LINE_AA)
#     cv2.imshow('Track Laser', mask)

#     if cv2.waitKey(1) & 0xFF == ord('q'):
#         break

# cap.release()

# cv2.destroyAllWindows()

src = cv2.imread("target.jpg")
grayImage = cv2.cvtColor(src, cv2.COLOR_BGR2GRAY)



gaussian = cv2.GaussianBlur(grayImage,[3,3],0,0,cv2.BORDER_DEFAULT)
median = cv2.medianBlur(gaussian,3)
canny =cv2.Canny(median, 150,50,3)
circles = cv2.HoughCircles(median, cv2.HOUGH_GRADIENT, dp = 1, minDist = 1, param1 =100, param2 = 100, minRadius= 0, maxRadius = 0)
if circles is not None:
    circles = np.uint16(np.around(circles))
    maxCircles = [0,0,0]
    for i in circles[0,:]:
        # if i[2] > maxCircles[2]: 
        #     maxCircles = i
    # i = maxCircles
        cv2.circle(median,(i[0],i[1]),i[2],(0,255,0),2)
        # draw the center of the circle
        cv2.circle(median,(i[0],i[1]),2,(0,0,255),3)

    cv2.namedWindow("Result", 1)
cv2.imshow("Result",median )


while(1):
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break


cv2.destroyAllWindows()