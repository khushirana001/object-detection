Backend Setup and Run Instructions
===================================

1. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`

2. Install dependencies:
   - `python -m pip install -r requirements.txt`

3. Start the backend API:
   - `uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload`

4. The backend exposes:
   - `POST /detect/frame` for image frame detection
   - `POST /detect/video` for video upload detection

5. The output video is served under `/static/output_videos/{filename}`.
