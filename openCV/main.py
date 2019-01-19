import sys
import cv2
import numpy as np
from keras.preprocessing import image
from keras.models import model_from_json

def run_recognition(video_dir):
    # OpenCV setup
    face_cascade = cv2.CascadeClassifier("./cascades/data/haarcascade_frontalface_alt2.xml")
    eyes_cascade = cv2.CascadeClassifier("./cascades/data/haarcascade_eye.xml")
    cap = cv2.VideoCapture(video_dir)
    frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))

    # Keras model setup
    model = model_from_json(open("./models/emotions_model_v1.0.json", "r").read())
    model.load_weights("./weights/emotions_model_weights.h5")

    emotions = ('angry', 'disgust', 'fear', 'happy', 'sad', 'surprise', 'neutral')

    happy_count = 0
    # if (cap.isOpened() == False): 
    while (cap.isOpened()):
        ret, frame = cap.read()
        
        if (np.shape(frame) == ()):
            break

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
    print(percentage)