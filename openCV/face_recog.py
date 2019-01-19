import cv2
import numpy as np

face_cascade = detect.cv2.cascadeClassifier("./cascades/data/haarcascade_frontalface_alt2.xml")
cap = cv2.VideoCapture()

while (True):
    ret, frame = cap.read()

    # Grayscale
    gray = cv2.cvtColor(frame, cv2.COLORBGR2GRAY)

    # Detect faces
    faces = cv2.detectMultiScale(gray, scaleFactor = 1.1, minNeighbors = 5)
    for (x, y, w, h) in faces:
        color = (0, 0, 255) # RED rectangle
        stroke = 2
        x_end = x + w
        y_end = y + h
        cv2.rectangle(frame, (x, y), (x_end, y_end), color, stroke)

    if (cv2.waitKey(20) & 0xFF == ord("q")):
        break
        

cap.release()
cv2.destroyAllWindows()