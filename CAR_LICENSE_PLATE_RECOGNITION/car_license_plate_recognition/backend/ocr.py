import requests
import os

OCR_API_KEY = "K82244746988957"  # Replace with your OCR.space API key

def extract_text(image_path):
    url = "https://api.ocr.space/parse/image"
    with open(image_path, 'rb') as image_file:
        files = {
            'file': image_file,
        }
        data = {
            'apikey': OCR_API_KEY,
            'language': 'eng',
        }
        response = requests.post(url, files=files, data=data)

    result = response.json()

    # Check if OCR returned results
    if result.get('IsErroredOnProcessing', False):
        return "Error processing the image"
    if result.get('ParsedResults'):
        return result['ParsedResults'][0]['ParsedText']
    return "No text found"
