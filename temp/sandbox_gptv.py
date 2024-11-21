import unittest
import requests
import logging
import http.client as http_client
import os
import base64

class sandbox_gptv(unittest.TestCase):
    
    def encode_image(self):
        abs_dir = os.path.dirname(__file__)
        rel_path = "\\..\\files\\images\\2birds.jpg"
        dir = abs_dir + rel_path

        with open(dir, 'rb') as image_file:
            data = image_file.read()
        return base64.b64encode(data).decode('utf-8')


    def test_gptv_basic(self):
        url = "https://eur-sdr-int-pub.nestle.com/api/dv-exp-sandbox-openai-api/1/genai"
        deploymentName = "/Azure"
        action = "/gptv"
        action_extension = "/completions"
        params  = {
            'api-version': '2023-07-01-preview'
        }
        headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'client_id': os.environ.get('client_id'),
            'client_secret': os.environ.get('client_secret')
        }
        data = {
            "messages": [
            {
                "role": "user",
                "content": [
                    {
                        "image": self.encode_image()
                    },
                    "Describe the image"
                ]
            }]
        }
        response = requests.post(url + deploymentName + action + action_extension, params=params, headers=headers, json=data, verify=False)
        self.assertEqual(response.status_code, 200)

if __name__ == '__main__':
    unittest.main()