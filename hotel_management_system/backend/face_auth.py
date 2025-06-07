import cv2
import numpy as np
from deepface import DeepFace
from sklearn.metrics.pairwise import cosine_similarity
import firebase_admin
from firebase_admin import credentials, firestore
import base64

# Load OpenCV's DNN face detector
face_net = cv2.dnn.readNetFromCaffe(
    "deploy.prototxt", "res10_300x300_ssd_iter_140000.caffemodel"
)

# Initialize Firebase
cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

# Store multiple detected face embeddings
initial_face_embeddings = []
MAX_INITIAL_IMAGES = 5
THRESHOLD = 0.3  # Lower threshold for stricter matching


def detect_face(frame):
    """Detects faces in an image using OpenCV's DNN model."""
    h, w = frame.shape[:2]
    blob = cv2.dnn.blobFromImage(frame, scalefactor=1.0, size=(
        300, 300), mean=(104.0, 177.0, 123.0))
    face_net.setInput(blob)
    detections = face_net.forward()

    for i in range(detections.shape[2]):
        confidence = detections[0, 0, i, 2]
        if confidence > 0.5:  # Minimum confidence threshold
            box = detections[0, 0, i, 3:7] * np.array([w, h, w, h])
            (startX, startY, endX, endY) = box.astype("int")
            face = frame[startY:endY, startX:endX]
            return face if face.size > 0 else None
    return None


def get_face_embedding(frame):
    """Extracts the face embedding from the detected face."""
    try:
        face = detect_face(frame)
        if face is None:
            return None

        # Convert BGR (OpenCV) to RGB (DeepFace expects RGB)
        rgb_face = cv2.cvtColor(face, cv2.COLOR_BGR2RGB)

        # Get face embedding using DeepFace
        result = DeepFace.represent(
            rgb_face, model_name="Facenet512", enforce_detection=False, detector_backend="opencv"
        )

        if result:
            return np.array(result[0]['embedding']).reshape(1, -1)
    except Exception as e:
        print(f"Error extracting face embedding: {e}")
    return None


def fetch_initial_images(unique_id):
    """Fetch the first 5 images for a specific user from Firestore and store their embeddings."""
    global initial_face_embeddings
    initial_face_embeddings.clear()

    print(f"[INFO] Fetching images for user: {unique_id}")

    # Reference Firestore document
    doc_ref = db.collection("images").document(unique_id)
    doc = doc_ref.get()

    if not doc.exists:
        print(f"[ERROR] No images found for user: {unique_id}")
        return

    data = doc.to_dict()
    image_list = data.get("images", [])[:MAX_INITIAL_IMAGES]

    print(
        f"[INFO] Retrieved {len(image_list)} images from Firestore for user {unique_id}")

    if not image_list:
        print("[ERROR] No images available in Firestore document.")
        return

    for idx, image_data in enumerate(image_list):
        try:
            # Decode base64 image
            image_bytes = base64.b64decode(image_data)
            image_array = np.frombuffer(image_bytes, np.uint8)
            frame = cv2.imdecode(image_array, cv2.IMREAD_COLOR)

            if frame is None:
                print(f"[ERROR] Image {idx+1} could not be decoded.")
                continue

            # Get face embedding
            embedding = get_face_embedding(frame)
            if embedding is not None:
                initial_face_embeddings.append(embedding)
            else:
                print(f"[WARNING] No face detected in image {idx+1}.")

        except Exception as e:
            print(f"[ERROR] Exception processing image {idx+1}: {e}")

    print(
        f"[INFO] Loaded {len(initial_face_embeddings)} face embeddings for user: {unique_id}")

 # Load initial images when script starts


def verify_identity(frame, userId):
    fetch_initial_images(userId)
    """Verifies if the detected face matches the initially stored face."""
    global initial_face_embeddings

    if frame is None or not isinstance(frame, np.ndarray):
        return {"error": "Invalid image format"}

    face_embedding = get_face_embedding(frame)
    if face_embedding is not None:
        if len(initial_face_embeddings) < MAX_INITIAL_IMAGES:
            return {"identity_status": "Not enough initial faces stored", "stored_faces": len(initial_face_embeddings)}

        # Compute average embedding
        avg_embedding = np.mean(initial_face_embeddings, axis=0)

        # Compute Cosine Similarity
        similarity = cosine_similarity(avg_embedding, face_embedding)[0][0]

        if similarity > 1 - THRESHOLD:
            return {"identity_status": "Same Face"}
        else:
            return {"identity_status": "Different Face Detected"}

    return {"identity_status": "No Face Detected"}
