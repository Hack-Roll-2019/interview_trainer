import cv2
import numpy as np
from keras.preprocessing import image
from keras.models import model_from_json

face_cascade = cv2.CascadeClassifier("./cascades/data/haarcascade_frontalface_alt2.xml")
cap = cv2.VideoCapture(0)

while (True):
    ret, frame = cap.read()
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, scaleFactor = 1.1, minNeighbors = 5)
    for (x, y, w, h) in faces:
        color = (0, 0, 255) # RED rectangle
        stroke = 2
        x_end = x + w
        y_end = y + h
        cv2.rectangle(frame, (x, y), (x_end, y_end), color, stroke)

    cv2.imshow("frame", frame)
    if (cv2.waitKey(20) & 0xFF == ord("q")):
        break
        
cap.release()
cv2.destroyAllWindows()