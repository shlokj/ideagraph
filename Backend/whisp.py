import whisper
import ssl

# Temporary Fix for whisper run-time:
ssl._create_default_https_context = ssl._create_unverified_context

def run_whisper(file):
    model = whisper.load_model("base")
    result = model.transcribe(file, fp16 = False)
    return result["text"]

# print(run_whisper("/Users/arjunrajloomba/Desktop/recording1.wav"))