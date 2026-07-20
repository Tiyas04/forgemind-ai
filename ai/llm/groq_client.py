import json
import re
from groq import Groq
from llm.output_parser import OutputParser
from config.settings import settings
import base64
class GroqClient:
    def __init__(self):
        self.client = Groq(api_key=settings.GROQ_API_KEY)
        self.model = settings.MODEL_NAME

    def generate(self, prompt: str, system_prompt: str | None = None, temperature: float = 0.2) -> str:
        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": prompt})

        response = self.client.chat.completions.create(
            model=self.model,
            messages=messages,
            temperature=temperature,
            max_tokens=settings.MAX_TOKENS
        )
        return response.choices[0].message.content

    def generate_json(self, prompt: str, system_prompt: str) -> dict | list:
        raw_response = self.generate(prompt, system_prompt, temperature=0.0)
        return OutputParser.parse_json(raw_response)

    def generate_vision(self, image_path: str, prompt: str) -> str:
        with open(image_path, "rb") as image_file:
            encoded_string = base64.b64encode(image_file.read()).decode('utf-8')
            
        messages = [
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": prompt},
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/jpeg;base64,{encoded_string}",
                        },
                    },
                ],
            }
        ]
        
        # Using Groq's high-speed vision model
        response = self.client.chat.completions.create(
            model=settings.VISION_MODEL_NAME,
            messages=messages,
            temperature=0.1,
            max_tokens=2048
        )
        return response.choices[0].message.content

    def generate_stream(self, prompt: str, system_prompt: str | None = None, temperature: float = 0.2):
        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": prompt})

        response = self.client.chat.completions.create(
            model=self.model,
            messages=messages,
            temperature=temperature,
            max_tokens=settings.MAX_TOKENS,
            stream=True
        )
        for chunk in response:
            if chunk.choices and chunk.choices[0].delta and chunk.choices[0].delta.content:
                yield chunk.choices[0].delta.content