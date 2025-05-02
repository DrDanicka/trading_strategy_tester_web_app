FROM python:3.10

WORKDIR /app

COPY app/ .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Expose Flask app (adjust if needed)
ENV FLASK_APP=app.py
ENV FLASK_RUN_HOST=0.0.0.0

# Start the Flask app
CMD ["flask", "run"]
