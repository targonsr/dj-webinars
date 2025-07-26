FROM python:3.12-slim as builder

WORKDIR /app

# Create non-root user in builder
RUN useradd -m -u 1001 appuser

COPY requirements.txt .

# Install dependencies into /home/appuser/.local
RUN mkdir -p /home/appuser/.local && chown -R appuser /home/appuser/.local && \
    pip install --no-cache-dir -r requirements.txt --prefix=/home/appuser/.local

# Production stage
FROM python:3.12-slim

WORKDIR /app

# Create non-root user for security
RUN groupadd -g 1001 appgroup && \
    useradd -m -u 1001 -g appgroup appuser && \
    apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Copy dependencies from builder stage (user-owned dir)
COPY --from=builder /home/appuser/.local /home/appuser/.local

# Copy only necessary files (use .dockerignore to exclude unnecessary files)
COPY . .

RUN chown -R appuser:appgroup /app /home/appuser/.local

USER appuser

ENV PATH=/home/appuser/.local/bin:$PATH
ENV PYTHONPATH=/home/appuser/.local/lib/python3.12/site-packages
ENV PYTHONDONTWRITEBYTECODE=1

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]