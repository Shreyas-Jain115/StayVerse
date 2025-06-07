import firebase_admin
from firebase_admin import credentials, firestore
import base64
from flask import Flask, request, jsonify
import cv2
import numpy as np
from flask_cors import CORS
import hashlib
from face_auth import verify_identity  # Import your face verification function

# Initialize Flask App
app = Flask(__name__)
CORS(app)

# Firebase Initialization
cred = credentials.Certificate("serviceAccountKey.json")  # Ensure this file exists
if not firebase_admin._apps:
    firebase_admin.initialize_app(cred)
db = firestore.client()

# Utility: Generate Firestore-safe unique ID from email
def generate_firestore_id(unique_id):
    return hashlib.sha256(unique_id.encode()).hexdigest()

# Upload Route
@app.route("/upload", methods=["POST"])
def upload_image():
    try:
        data = request.json
        image_data = data.get("image")
        unique_id = data.get("unique_id")  # This is actually an email from frontend
        print(f"[INFO] Uploading image for user: {unique_id}")
        if not image_data or not unique_id:
            return jsonify({"error": "Missing image or unique_id"}), 400

        doc_id = generate_firestore_id(unique_id)

        if "," in image_data:
            image_data = image_data.split(",")[1]

        image_bytes = base64.b64decode(image_data)
        image_array = np.frombuffer(image_bytes, np.uint8)
        frame = cv2.imdecode(image_array, cv2.IMREAD_COLOR)

        if frame is None:
            return jsonify({"error": "Failed to decode image"}), 400

        doc_ref = db.collection("images").document(doc_id)
        doc = doc_ref.get()

        image_list = doc.to_dict().get("images", []) if doc.exists else []

        if len(image_list) >= 5:
            return jsonify({"error": "Maximum of 5 images allowed"}), 400

        image_list.append(image_data)
        doc_ref.set({"unique_id": unique_id, "images": image_list})

        return jsonify({"message": "Image stored successfully!", "images_count": len(image_list)}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Retrieve Images
@app.route("/retrieve/<unique_id>", methods=["GET"])
def retrieve_images(unique_id):
    try:
        doc_id = generate_firestore_id(unique_id)
        doc = db.collection("images").document(doc_id).get()

        if not doc.exists:
            return jsonify({"error": "No image found for this ID"}), 404

        return jsonify(doc.to_dict()), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Verify Face
@app.route("/verify", methods=["POST"])
def verify_face():
    try:
        data = request.json
        image_data = data.get("image")
        unique_id = data.get("unique_id")

        if not image_data or not unique_id:
            return jsonify({"error": "Missing image or unique_id"}), 400

        doc_id = generate_firestore_id(unique_id)

        if "," in image_data:
            image_data = image_data.split(",")[1]

        image_bytes = base64.b64decode(image_data)
        image_array = np.frombuffer(image_bytes, np.uint8)
        frame = cv2.imdecode(image_array, cv2.IMREAD_COLOR)

        if frame is None:
            return jsonify({"error": "Failed to decode image"}), 400

        result = verify_identity(frame, doc_id)
        return jsonify(result), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Check Images Count
@app.route("/check_images/<unique_id>", methods=["GET"])
def check_images_count(unique_id):
    try:
        print(f"[INFO] Checking images for user: {unique_id}")
        doc_id = generate_firestore_id(unique_id)
        doc = db.collection("images").document(doc_id).get()

        if not doc.exists:
            return jsonify({"uploaded": False, "count": 0, "message": "No images found for this ID"}), 200

        data = doc.to_dict()
        images = data.get("images", [])
        count = len(images)
        uploaded = count >= 5

        return jsonify({"uploaded": uploaded, "count": count}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Run App
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
