from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from ultralytics import YOLO
import cv2
import os
import uuid
import base64
import numpy as np
from scipy.spatial import distance as dist
from imutils import face_utils
import dlib
from dotenv import load_dotenv
from pymongo import MongoClient
import os
from datetime import datetime
import requests

# ------------------- MONGODB SETUP -------------------

load_dotenv()

client = MongoClient(os.getenv("MONGO_URI"))

db = client["civic_sense_ai"]

detections = db["detections"]

# ------------------- FLASK SERVER SETUP -------------------

app = Flask(__name__)
CORS(app)

@app.route("/")
def home():
    return "Backend API Running"

# ------------------- COMMON ML MODEL -------------------


yolo_model = YOLO("./models/yolov8n.pt")

# ------------------- HELMET DETECTION -------------------

helmet_model = YOLO("./models/helmet_model.pt")
UPLOAD_FOLDER = "uploads"
RESULT_FOLDER = "results"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(RESULT_FOLDER, exist_ok=True)

@app.route("/detect", methods=["POST"])
def detect():

    if "image" not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    file = request.files["image"]

    filename = f"{uuid.uuid4()}.jpg"

    upload_path = os.path.join(UPLOAD_FOLDER, filename)

    file.save(upload_path)

    image = cv2.imread(upload_path)

    results = helmet_model(image)

    detected = False

    prediction = []

    annotated = image.copy()

    for result in results:

        boxes = result.boxes

        for box in boxes:

            cls = int(box.cls[0])

            confidence = float(box.conf[0])

            class_name = helmet_model.names[cls]

            x1, y1, x2, y2 = map(int, box.xyxy[0])

            prediction.append({
                "class": class_name,
                "confidence": round(confidence, 3)
            })

            if class_name.lower() == "helmet":
                detected = True

            color = (0,255,0)

            cv2.rectangle(
                annotated,
                (x1,y1),
                (x2,y2),
                color,
                2
            )

            cv2.putText(
                annotated,
                f"{class_name} {confidence:.2f}",
                (x1,y1-10),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.6,
                color,
                2
            )

    result_path = os.path.join(RESULT_FOLDER, filename)

    cv2.imwrite(result_path, annotated)

    return jsonify({
        "helmet_detected": detected,
        "detections": prediction,
        "result_image": filename
    })


# ------------------- RED LIGHT VIOLATION DETECTION -------------------

@app.route("/traffic-violation", methods=["POST"])
def traffic_violation():

    if "video" not in request.files:
        return jsonify({"error": "No video uploaded"}), 400


    file = request.files["video"]

    filename = f"{uuid.uuid4()}.mp4"

    upload_path = os.path.join(
        UPLOAD_FOLDER,
        filename
    )

    file.save(upload_path)

    output_filename = f"processed_{filename}"

    output_path = os.path.join(
        RESULT_FOLDER,
        output_filename
    )

    cap = cv2.VideoCapture(upload_path)

    width = int(
        cap.get(cv2.CAP_PROP_FRAME_WIDTH)
    )

    height = int(
        cap.get(cv2.CAP_PROP_FRAME_HEIGHT)
    )

    fps = cap.get(
        cv2.CAP_PROP_FPS
    )

    if fps == 0:
        fps = 25

    writer = cv2.VideoWriter(
    output_path,
    cv2.VideoWriter_fourcc(*"avc1"),
    fps,
    (width, height)
)

    if not writer.isOpened():
        writer = cv2.VideoWriter(
            output_path,
            cv2.VideoWriter_fourcc(*"mp4v"),
            fps,
            (width, height)
        )

    LINE_Y = int(height * 0.55)

    vehicle_history = {}

    violated_ids = set()

    violations = 0

    red_light = True

    violation_image = None

    while True:
        ret, frame = cap.read()

        if not ret:
            break

        results = yolo_model.track(
            frame,
            persist=True,
            tracker="bytetrack.yaml",
            verbose=False
        )

        cv2.line(
            frame,
            (0,LINE_Y),
            (width,LINE_Y),
            (0,0,255),
            3
        )

        if results[0].boxes.id is not None:
            boxes = results[0].boxes.xyxy.cpu().numpy()

            ids = (
                results[0]
                .boxes
                .id
                .cpu()
                .numpy()
                .astype(int)
            )

            classes = (
                results[0]
                .boxes
                .cls
                .cpu()
                .numpy()
                .astype(int)
            )

            for box,track_id,cls in zip(
                boxes,
                ids,
                classes
            ):
                # car truck bus motorcycle
                if cls not in [2,3,5,7]:
                    continue

                x1,y1,x2,y2 = box.astype(int)

                cy = int(
                    (y1+y2)/2
                )

                violation=False

                if track_id in vehicle_history:
                    previous_y = vehicle_history[track_id]

                    if (
                        red_light
                        and previous_y < LINE_Y
                        and cy >= LINE_Y
                    ):
                        violation = True

                        if track_id not in violated_ids:

                            violations += 1
                            violated_ids.add(track_id)

                            # Save first violation frame
                            if violation_image is None:

                                temp = frame.copy()

                                cv2.rectangle(
                                    temp,
                                    (x1, y1),
                                    (x2, y2),
                                    (0, 0, 255),
                                    3
                                )

                                cv2.putText(
                                    temp,
                                    "RED LIGHT VIOLATION",
                                    (x1, y1 - 10),
                                    cv2.FONT_HERSHEY_SIMPLEX,
                                    0.8,
                                    (0,0,255),
                                    2
                                )

                                violation_image = f"{uuid.uuid4()}.jpg"

                                cv2.imwrite(
                                    os.path.join(RESULT_FOLDER, violation_image),
                                    temp
                                )

                vehicle_history[track_id]=cy

                color=(0,255,0)

                if track_id in violated_ids:
                    color=(0,0,255)

                    cv2.putText(
                        frame,
                        "RED LIGHT VIOLATION",
                        (x1,y1-10),
                        cv2.FONT_HERSHEY_SIMPLEX,
                        0.7,
                        color,
                        2
                    )

                cv2.rectangle(
                    frame,
                    (x1,y1),
                    (x2,y2),
                    color,
                    2
                )

                cv2.putText(
                    frame,
                    f"ID {track_id}",
                    (x1,y2+20),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    0.6,
                    color,
                    2
                )

        cv2.putText(
            frame,
            "RED LIGHT",
            (20,40),
            cv2.FONT_HERSHEY_SIMPLEX,
            1,
            (0,0,255),
            3
        )

        writer.write(frame)

    cap.release()
    writer.release()

    return jsonify({
        "violations": violations,
        "result_video": output_filename,
        "result_image": violation_image
    })

# ------------------- WRONG SIDE DETECTION -------------------

@app.route("/wrong-side-detection", methods=["POST"])
def wrong_side_detection():

    if "video" not in request.files:
        return jsonify({
            "error": "No video uploaded"
        }),400

    file = request.files["video"]

    filename = f"{uuid.uuid4()}.mp4"

    upload_path = os.path.join(
        UPLOAD_FOLDER,
        filename
    )

    file.save(upload_path)

    output_filename = f"wrong_side_{filename}"

    output_path = os.path.join(
        RESULT_FOLDER,
        output_filename
    )

    cap = cv2.VideoCapture(upload_path)

    width = int(
        cap.get(cv2.CAP_PROP_FRAME_WIDTH)
    )

    height = int(
        cap.get(cv2.CAP_PROP_FRAME_HEIGHT)
    )

    fps = cap.get(
        cv2.CAP_PROP_FPS
    )

    if fps == 0:
        fps = 25

    writer = cv2.VideoWriter(
        output_path,
        cv2.VideoWriter_fourcc(*"avc1"),
        fps,
        (width,height)
    )

    if not writer.isOpened():

        writer = cv2.VideoWriter(
            output_path,
            cv2.VideoWriter_fourcc(*"mp4v"),
            fps,
            (width,height)
        )


    # ----------------------------
    # ROAD DIRECTION SETTINGS
    # ----------------------------

    # Allowed direction:
    # right movement = True
    # left movement = False

    ALLOWED_DIRECTION = "RIGHT"

    vehicle_history = {}

    wrong_side_ids = set()

    wrong_side_count = 0

    wrong_side_image = None

    while True:
        ret,frame = cap.read()

        if not ret:
            break

        results = yolo_model.track(
            frame,
            persist=True,
            tracker="bytetrack.yaml",
            verbose=False
        )

        if results[0].boxes.id is not None:
            boxes = (
                results[0]
                .boxes
                .xyxy
                .cpu()
                .numpy()
            )

            ids = (
                results[0]
                .boxes
                .id
                .cpu()
                .numpy()
                .astype(int)
            )

            classes = (
                results[0]
                .boxes
                .cls
                .cpu()
                .numpy()
                .astype(int)
            )

            for box,track_id,cls in zip(
                boxes,
                ids,
                classes
            ):
                # vehicle classes
                if cls not in [2,3,5,7]:
                    continue

                x1,y1,x2,y2 = box.astype(int)

                cx = int(
                    (x1+x2)/2
                )

                cy = int(
                    (y1+y2)/2
                )

                wrong_side = False

                if track_id in vehicle_history:
                    prev_x,prev_y = vehicle_history[track_id]

                    movement_x = cx - prev_x

                    # Vehicle moving opposite direction

                    if ALLOWED_DIRECTION == "RIGHT":

                        if movement_x < -5:
                            wrong_side=True

                    else:
                        if movement_x > 5:
                            wrong_side=True

                vehicle_history[track_id]=(cx,cy)

                color=(0,255,0)

                if wrong_side:
                    if track_id not in wrong_side_ids:
                        wrong_side_count += 1
                        wrong_side_ids.add(track_id)
                        if wrong_side_image is None:
                            temp = frame.copy()
                            cv2.rectangle(
                                temp,
                                (x1,y1),
                                (x2,y2),
                                (0,0,255),
                                3
                            )
                            cv2.putText(
                                temp,
                                "WRONG SIDE",
                                (x1,y1-10),
                                cv2.FONT_HERSHEY_SIMPLEX,
                                0.8,
                                (0,0,255),
                                2
                            )

                            wrong_side_image = f"{uuid.uuid4()}.jpg"

                            cv2.imwrite(
                                os.path.join(RESULT_FOLDER, wrong_side_image),
                                temp
                            )

                if track_id in wrong_side_ids:
                    color=(0,0,255)

                    cv2.putText(
                        frame,
                        "WRONG SIDE",
                        (x1,y1-10),
                        cv2.FONT_HERSHEY_SIMPLEX,
                        0.8,
                        color,
                        2
                    )

                cv2.rectangle(
                    frame,
                    (x1,y1),
                    (x2,y2),
                    color,
                    2
                )

                cv2.putText(
                    frame,
                    f"ID {track_id}",
                    (x1,y2+20),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    0.6,
                    color,
                    2
                )

        cv2.putText(
            frame,
            "Allowed Direction: RIGHT",
            (20,40),
            cv2.FONT_HERSHEY_SIMPLEX,
            1,
            (255,255,0),
            3
        )

        writer.write(frame)

    cap.release()
    writer.release()

    return jsonify({
        "wrong_side_count": wrong_side_count,
        "result_video": output_filename,
        "result_image": wrong_side_image
    })


# ------------------- TRAFFIC DENSITY DETECTION -------------------

@app.route("/traffic-density", methods=["POST"])
def traffic_density():
    if "image" not in request.files:
        return jsonify({
            "error": "No image uploaded"
        }),400

    file = request.files["image"]

    filename = f"{uuid.uuid4()}.jpg"

    upload_path = os.path.join(
        UPLOAD_FOLDER,
        filename
    )

    file.save(upload_path)

    frame = cv2.imread(upload_path)

    results = yolo_model(
        frame
    )

    vehicle_count = {
        "car":0,
        "motorcycle":0,
        "bus":0,
        "truck":0
    }

    annotated = frame.copy()

    for result in results:
        boxes = result.boxes

        for box in boxes:
            cls = int(box.cls[0])
            confidence = float(box.conf[0])

            # COCO classes
            names = {
                2:"car",
                3:"motorcycle",
                5:"bus",
                7:"truck"
            }

            if cls not in names:
                continue

            vehicle = names[cls]

            vehicle_count[vehicle]+=1

            x1,y1,x2,y2 = map(
                int,
                box.xyxy[0]
            )

            cv2.rectangle(
                annotated,
                (x1,y1),
                (x2,y2),
                (0,255,0),
                2
            )

            cv2.putText(
                annotated,
                vehicle,
                (x1,y1-10),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.7,
                (0,255,0),
                2
            )

    total = sum(
        vehicle_count.values()
    )

    y=40

    cv2.putText(
        annotated,
        f"Total Vehicles: {total}",
        (20,y),
        cv2.FONT_HERSHEY_SIMPLEX,
        1,
        (0,255,255),
        3
    )

    y+=40

    for k,v in vehicle_count.items():
        cv2.putText(
            annotated,
            f"{k}: {v}",
            (20,y),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.8,
            (255,255,255),
            2
        )
        y+=35

    result_filename = f"{uuid.uuid4()}.jpg"

    result_path=os.path.join(
        RESULT_FOLDER,
        result_filename 
    )

    cv2.imwrite(
        result_path,
        annotated
    )

    return jsonify({
        "vehicle_count":vehicle_count,
        "total":total,
        "result_image":result_filename
    })

# ------------------- ACCIDENT DETECTION -------------------

@app.route("/accident-detection", methods=["POST"])
def accident_detection():
    if "video" not in request.files:
        return jsonify({
            "error":"No video uploaded"
        }),400

    file=request.files["video"]

    filename=f"{uuid.uuid4()}.mp4"

    upload_path=os.path.join(
        UPLOAD_FOLDER,
        filename
    )

    file.save(upload_path)

    output_filename=f"accident_{filename}"

    output_path=os.path.join(
        RESULT_FOLDER,
        output_filename
    )

    cap=cv2.VideoCapture(upload_path)

    width=int(
        cap.get(
            cv2.CAP_PROP_FRAME_WIDTH
        )
    )

    height=int(
        cap.get(
            cv2.CAP_PROP_FRAME_HEIGHT
        )
    )

    fps=cap.get(
        cv2.CAP_PROP_FPS
    )

    if fps==0:
        fps=25

    writer=cv2.VideoWriter(
        output_path,
        cv2.VideoWriter_fourcc(*"avc1"),
        fps,
        (width,height)
    )

    if not writer.isOpened():
        writer=cv2.VideoWriter(
            output_path,
            cv2.VideoWriter_fourcc(*"mp4v"),
            fps,
            (width,height)
        )

    vehicle_history={}

    accident_ids=set()

    VEHICLE_CLASSES=[
        2,3,5,7
    ]

    COLLISION_DISTANCE=30

    STOP_THRESHOLD=5

    accident_image = None

    while True:
        ret,frame=cap.read()

        if not ret:
            break

        current_positions={}

        results=yolo_model.track(
            frame,
            persist=True,
            tracker="bytetrack.yaml",
            verbose=False
        )

        if results[0].boxes.id is not None:
            boxes=(
                results[0]
                .boxes
                .xyxy
                .cpu()
                .numpy()
            )

            ids=(
                results[0]
                .boxes
                .id
                .cpu()
                .numpy()
                .astype(int)

            )

            classes=(
                results[0]
                .boxes
                .cls
                .cpu()
                .numpy()
                .astype(int)

            )

            for box,track_id,cls in zip(
                boxes,
                ids,
                classes
            ):
                if cls not in VEHICLE_CLASSES:
                    continue

                x1,y1,x2,y2=box.astype(int)

                cx=int(
                    (x1+x2)/2
                )

                cy=int(
                    (y1+y2)/2
                )

                current_positions[track_id]=(cx,cy)

                speed=0

                if track_id in vehicle_history:
                    px,py,old_speed=vehicle_history[track_id]

                    speed=(
                        (cx-px)**2 +
                        (cy-py)**2
                    )**0.5

                    if (
                        old_speed > STOP_THRESHOLD
                        and speed < 2
                    ):

                        accident_ids.add(track_id)

                        if accident_image is None:

                            temp = frame.copy()

                            cv2.rectangle(
                                temp,
                                (x1,y1),
                                (x2,y2),
                                (0,0,255),
                                3
                            )

                            cv2.putText(
                                temp,
                                "ACCIDENT DETECTED",
                                (x1,y1-10),
                                cv2.FONT_HERSHEY_SIMPLEX,
                                0.8,
                                (0,0,255),
                                2
                            )

                            accident_image = f"{uuid.uuid4()}.jpg"

                            cv2.imwrite(
                                os.path.join(RESULT_FOLDER, accident_image),
                                temp
                            )

                vehicle_history[track_id]=(
                    cx,
                    cy,
                    speed
                )

                color=(0,255,0)

                if track_id in accident_ids:
                    color=(0,0,255)

                    cv2.putText(
                        frame,
                        "ACCIDENT DETECTED",
                        (x1,y1-10),
                        cv2.FONT_HERSHEY_SIMPLEX,
                        0.8,
                        color,
                        2
                    )

                cv2.rectangle(
                    frame,
                    (x1,y1),
                    (x2,y2),
                    color,
                    2
                )

                cv2.putText(
                    frame,
                    f"ID {track_id}",
                    (x1,y2+25),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    0.6,
                    color,
                    2
                )

            # collision check
            pos=list(
                current_positions.keys()
            )

            for i in range(len(pos)):
                for j in range(i+1,len(pos)):
                    id1=pos[i]
                    id2=pos[j]
                    x1,y1=current_positions[id1]
                    x2,y2=current_positions[id2]

                    dist=(
                        (x1-x2)**2+
                        (y1-y2)**2
                    )**0.5

                    if dist<COLLISION_DISTANCE:
                        accident_ids.add(id1)
                        accident_ids.add(id2)

                        cv2.putText(
                            frame,
                            "POSSIBLE COLLISION",
                            (50,80),
                            cv2.FONT_HERSHEY_SIMPLEX,
                            1,
                            (0,0,255),
                            3
                        )

                        if accident_image is None:
                            accident_image = f"{uuid.uuid4()}.jpg"
                            cv2.imwrite(
                                os.path.join(RESULT_FOLDER, accident_image),
                                frame
                            )

        cv2.putText(
            frame,
            f"Collisions: {len(accident_ids)}",
            (20,40),
            cv2.FONT_HERSHEY_SIMPLEX,
            1,
            (0,255,255),
            3
        )

        writer.write(frame)

    cap.release()
    writer.release()

    return jsonify({
        "accidents": len(accident_ids),
        "result_video": output_filename,
        "result_image": accident_image
    })

# ------------------- Helpers -------------------

@app.route("/result/<filename>")
def result(filename):
    path = os.path.join(RESULT_FOLDER, filename)

    if not os.path.exists(path):
        return jsonify({"error": "File not found"}), 404

    return send_file(
        path,
        mimetype="image/jpeg"
    )

@app.route("/video/<filename>")
def get_video(filename):

    path = os.path.join(RESULT_FOLDER, filename)

    if not os.path.exists(path):
        return jsonify({
            "error":"Video not found"
        }),404


    response = send_file(
        path,
        mimetype="video/mp4",
        conditional=True
    )

    response.headers["Accept-Ranges"] = "bytes"

    return response

# ------------------- DROWSINESS DETECTION -------------------

shapePredictor = "./models/shape_predictor_68_face_landmarks.dat"

detector = dlib.get_frontal_face_detector()
predictor = dlib.shape_predictor(shapePredictor)

(lStart, lEnd) = face_utils.FACIAL_LANDMARKS_IDXS["left_eye"]
(rStart, rEnd) = face_utils.FACIAL_LANDMARKS_IDXS["right_eye"]

EAR_THRESH = 0.30
EAR_FRAMES = 20

frame_counter = 0

def eye_aspect_ratio(eye):
    A = dist.euclidean(eye[1], eye[5])
    B = dist.euclidean(eye[2], eye[4])
    C = dist.euclidean(eye[0], eye[3])
    return (A + B) / (2.0 * C)

@app.route("/drowsiness-frame", methods=["POST"])
def drowsiness():

    global frame_counter

    data = request.json["image"]

    encoded = data.split(",")[1]

    img = base64.b64decode(encoded)

    npimg = np.frombuffer(img, np.uint8)

    frame = cv2.imdecode(npimg, cv2.IMREAD_COLOR)

    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

    rects = detector(gray)

    drowsy = False
    ear_value = 0

    for rect in rects:

        shape = predictor(gray, rect)
        shape = face_utils.shape_to_np(shape)

        leftEye = shape[lStart:lEnd]
        rightEye = shape[rStart:rEnd]

        leftEAR = eye_aspect_ratio(leftEye)
        rightEAR = eye_aspect_ratio(rightEye)

        ear = (leftEAR + rightEAR) / 2

        ear_value = float(ear)

        if ear < EAR_THRESH:

            frame_counter += 1

            if frame_counter >= EAR_FRAMES:
                drowsy = True

        else:
            frame_counter = 0

    return jsonify({
        "drowsy": drowsy,
        "ear": round(ear_value,3)
    })


# ------------------- Number Plate OCR Text Recognition -------------------

def detect_number_plate(image_path):

    api_key = os.getenv("OCR_API_KEY")

    if not api_key:
        print("OCR_API_KEY not found in .env")
        return "Not Detected"

    url = "https://api.ocr.space/parse/image"

    try:
        with open(image_path, "rb") as f:

            response = requests.post(
                url,
                files={
                    "file": f
                },
                data={
                    "apikey": api_key,
                    "language": "eng",
                    "OCREngine": "2"
                },
                timeout=30
            )

        result = response.json()

        if result.get("ParsedResults"):

            text = result["ParsedResults"][0].get(
                "ParsedText",
                ""
            ).strip()

            if text:
                return text

        return "Not Detected"

    except Exception as e:

        print("OCR failed:", e)

        return "Not Detected"


# ------------------- NUMBER PLATE DETECTION -------------------

@app.route("/number-plate", methods=["POST"])
def number_plate():

    if "image" not in request.files:
        return jsonify({
            "error": "No image uploaded"
        }), 400

    file = request.files["image"]

    filename = f"{uuid.uuid4()}.jpg"

    upload_path = os.path.join(
        UPLOAD_FOLDER,
        filename
    )

    file.save(upload_path)

    # Read uploaded image
    image = cv2.imread(upload_path)

    if image is None:
        return jsonify({
            "error": "Invalid image"
        }), 400

    # Run OCR
    numberplate = detect_number_plate(upload_path)

    return jsonify({
        "numberplate": numberplate,
    })

# ------------------- MongoDB Data Storage -------------------

def send_accident_alert(latitude, longitude):

    webhook_url = os.getenv("WEBHOOK_NOTIFIER_API")

    if not webhook_url:
        print("WEBHOOK_URL not configured")
        return

    try:
        response = requests.get(
            webhook_url,
            timeout=10
        )

        print(
            "Webhook:",
            response.status_code,
            response.text
        )

    except Exception as e:
        print("Webhook notification failed:", e)

@app.route("/store-detection", methods=["POST"])
def store_detection():

    data = request.json

    image_filename = data["image"]

    latitude = data.get("latitude")
    longitude = data.get("longitude")

    image_path = os.path.join(
        RESULT_FOLDER,
        image_filename
    )

    if not os.path.exists(image_path):
        return jsonify({
            "error": "Image not found"
        }),404

    numberplate = detect_number_plate(image_path)


    with open(image_path, "rb") as img_file:
        encoded_image = base64.b64encode(
            img_file.read()
        ).decode("utf-8")


    detections.insert_one({
        "type": data["type"],
        "image": encoded_image,
        "latitude": latitude,
        "longitude": longitude,
        "numberplate": numberplate,
        "createdAt": datetime.utcnow()
    })

    # Send alert AFTER successful database storage
    if data["type"] == "Accident Detected":

        send_accident_alert(
            latitude,
            longitude
        )

    return jsonify({
        "success": True
    })
# ------------------- GET MongoDB Data Storage -------------------

@app.route("/detections", methods=["GET"])
def get_detections():

    data = list(
        detections.find(
            {},
            {
                "_id":0,
                "image":1,
                "type":1,
                "latitude": 1,
                "longitude": 1,
                "numberplate":1,
                "createdAt":1
            }
        )
        .sort(
            "createdAt",
            -1
        )
    )


    counts = {
        "Helmet":0,
        "Wrong Side":0,
        "Signal":0,
        "Accident":0
    }


    for item in data:

        detection_type=item.get("type","")


        if "Helmet" in detection_type:
            counts["Helmet"] += 1

        elif "Accident" in detection_type:
            counts["Accident"] += 1

        elif "Wrong Side" in detection_type:
            counts["Wrong Side"] += 1

        elif "Red Light" in detection_type:
            counts["Signal"] += 1


        item["createdAt"] = item["createdAt"].strftime(
            "%d/%m/%Y %H:%M"
        )


    return jsonify({
        "counts":counts,
        "detections":data
    })

# ------------------- Server Start -------------------

if __name__ == "__main__":
    app.run(debug=True)