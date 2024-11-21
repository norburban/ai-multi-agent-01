import unittest
import requests
import logging
import http.client as http_client
import os

class sandbox_gpt35(unittest.TestCase):
    
    def test_gpt35_chat_completions(self):
        url = "https://eur-sdr-int-pub.nestle.com/api/dv-exp-sandbox-openai-api/1/openai/deployments"
        deploymentName = "/ChatGPTv16k"
        action = "/chat"
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
                "content": "How many countries are there in the European Union?"
            }]
        }
        response = requests.post(url + deploymentName + action + action_extension, params=params, headers=headers, json=data, verify=False)
        self.assertEqual(response.status_code, 200)

if __name__ == '__main__':
    unittest.main()