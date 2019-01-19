import sys
import time
from pathlib import Path

import cv2
import dlib
import imutils
import numpy as np

from imutils import face_utils
from keras.models import model_from_json
from keras.preprocessing import image
from scipy.spatial import distance as dist

EYE_AR_THRESH = 0.3
EYE_AR_CONSEC_FRAMES = 3

COUNTER = 0
TOTAL = 0

def eye_aspect_ratio(eye):
	# compute the euclidean distances between the two sets of
	# vertical eye landmarks (x, y)-coordinates
	A = dist.euclidean(eye[1], eye[5])
	B = dist.euclidean(eye[2], eye[4])
 
	# compute the euclidean distance between the horizontal
	# eye landmark (x, y)-coordinates
	C = dist.euclidean(eye[0], eye[3])
 
	# compute the eye aspect ratio
	ear = (A + B) / (2.0 * C)
 
	# return the eye aspect ratio
	return ear

def run_recognition(video_dir):
    # OpenCV setup
    cascades_folder = Path("./cascades/data/")

    face_cascade_file = cascades_folder / "haarcascade_frontalface_alt2.xml"
    face_cascade = cv2.CascadeClassifier(face_cascade_file.as_posix())

    eyes_cascade_file = cascades_folder / "haarcascade_eye.xml"
    eyes_cascade = cv2.CascadeClassifier(eyes_cascade_file.as_posix())

    cap = cv2.VideoCapture(video_dir)
    frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))

    # Keras model setup
    model_folder = Path("./models/")
    model_file = model_folder / "emotions_model_v1.0.json"
    model = model_from_json(open(model_file.as_posix(), "r").read())

    weights_folder = Path("./weights/")
    weights_file = weights_folder / "emotions_model_weights.h5"
    model.load_weights(weights_file.as_posix())

    emotions = ('angry', 'disgust', 'fear', 'happy', 'sad', 'surprise', 'neutral')

    # Eye blink detector setup
    # detector = dlib.get_frontal_face_detector()
    # predictor = dlib.shape_predictor()

    # (lStart, lEnd) = face_utils.FACIAL_LANDMARKS_IDXS["left_eye"]
    # (rStart, rEnd) = face_utils.FACIAL_LANDMARKS_IDXS["right_eye"]

    happy_count = 0
    if (cap.isOpened() != False): 
        while (cap.isOpened()):
            ret, frame = cap.read()
            
            if (np.shape(frame) == ()):
                break

            frame = imutils.resize(frame, width = 450)
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            faces = face_cascade.detectMultiScale(gray, scaleFactor = 1.1, minNeighbors = 5)

            for (x, y, w, h) in faces:
                roi_gray = gray[y:y+h, x:x+w]
                roi_color = frame[y:y+h, x:x+w]
                eyes = eyes_cascade.detectMultiScale(roi_gray, 1.1, 3)

                for (ex, ey, ew, eh) in eyes:
                    cv2.rectangle(roi_color, (ex, ey), (ex + ew, ey + eh), (0, 255, 0), 2)

                cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 0, 255), 2)

                detected_face = frame[int(y):int(y + h), int(x):int(x + w)]
                detected_face = cv2.cvtColor(detected_face, cv2.COLOR_BGR2GRAY)
                detected_face = cv2.resize(detected_face, (48, 48))

                img_pixels = image.img_to_array(detected_face)
                img_pixels = np.expand_dims(img_pixels, axis = 0)
                img_pixels /= 255

                predictions = model.predict(img_pixels)
                max_index = np.argmax(predictions[0])
                emotion = emotions[max_index]

                if (emotion == "happy"):
                    happy_count += 1

            cv2.imshow("frame", frame)
            if cv2.waitKey(20) & 0xFF == ord('q'):
                break

    cap.release()
    cv2.destroyAllWindows()

    if (frame_count != 0):
        return(happy_count / frame_count)
    else:
        return 0

if __name__ == "__main__":
    percentage = run_recognition(sys.argv[1])
    print(round(percentage, 2))