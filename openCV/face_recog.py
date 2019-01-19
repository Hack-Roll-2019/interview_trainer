import cv2
import numpy as np
from keras.preprocessing import image
from keras.models import model_from_json

def run_recognition():
    # OpenCV setup
    face_cascade = cv2.CascadeClassifier("./cascades/data/haarcascade_frontalface_alt2.xml")
    cap = cv2.VideoCapture("./videos/video.mp4")
    frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))

    # Keras model setup
    model = model_from_json(open("./models/emotions_model_v1.0.json", "r").read())
    model.load_weights("./weights/emotions_model_weights.h5")

    emotions = ('angry', 'disgust', 'fear', 'happy', 'sad', 'surprise', 'neutral')

    happy_count = 0
    if (cap.isOpened() == False): 
        while (cap.isOpened()):
            ret, frame = cap.read()
            
            if (np.shape(frame) == ()):
                break

            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            faces = face_cascade.detectMultiScale(gray, scaleFactor = 1.1, minNeighbors = 5)

            for (x, y, w, h) in faces:
                color = (0, 0, 255) # RED rectangle
                stroke = 2
                x_end = x + w
                y_end = y + h
                cv2.rectangle(frame, (x, y), (x_end, y_end), color, stroke)

                detected_face = frame[int(y):int(y_end), int(x):int(x_end)]
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
                # cv2.putText(frame, emotion, (int(x), int(y)), cv2.FONT_HERSHEY_SIMPLEX, 1, (255,255,255), 2)

            # cv2.imshow("frame", frame)
            # if (cv2.waitKey(20) & 0xFF == ord("q")):
            #     break

    cap.release()
    cv2.destroyAllWindows()

    if (frame_count != 0):
        return(happy_count / frame_count)
    else:
        return 0

if __name__ == "__main__":
    percentage = run_recognition()
    print(percentage)