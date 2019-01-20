import sys
import cv2
import numpy as np

from pathlib import Path
from keras.preprocessing import image
from keras.models import model_from_json

def run_recognition(video_dir):
    # Folders setup
    cascades_folder = Path("./cascades/data/")
    models_folder = Path("./models/")
    weights_folder = Path("./weights/")

    # OpenCV setup
    cascade_file = cascades_folder / "haarcascade_frontalface_alt2.xml"
    face_cascade = cv2.CascadeClassifier(cascade_file.as_posix())
    cap = cv2.VideoCapture(video_dir)
    frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))

    # Keras model setup
    model_file = models_folder / "emotions_model_v1.0.json"
    model = model_from_json(open(model_file.as_posix(), "r").read())

    weight_file = weights_folder / "emotions_model_weights.h5"
    model.load_weights(weight_file.as_posix())

    emotions = ('angry', 'disgust', 'fear', 'happy', 'sad', 'surprise', 'neutral')

    happy_count = 0
    if (cap.isOpened() == True): 
        while (cap.isOpened()):
            ret, frame = cap.read()
            
            if (np.shape(frame) == ()):
                break

            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            faces = face_cascade.detectMultiScale(gray, scaleFactor = 1.1, minNeighbors = 5)

            for (x, y, w, h) in faces:
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
            if (cv2.waitKey(20) & 0xFF == ord("q")):
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