# Loki Log Generator

This project generates realistic, bursty, and configurable log traffic for pre-filling a [Grafana Loki](https://grafana.com/oss/loki/) instance. It simulates multiple hosts, users, databases, and jobs, and supports several traffic modes for testing and demo purposes.

## Features

- Simulates HTTP, app, DB, cache, and filesystem logs
- Configurable number of hosts, users, DB connections, and jobs
- Realistic day/night cycles, error/warning bursts, and traffic peaks
- Multiple modes: historical, current, and random
- Batches logs and sends them to Loki, also writing to a local file
- Per-batch labels including service, environment, and job

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**  
   Copy `.local.env` to `.env` and adjust as needed.

3. **Run the generator:**
   ```bash
   npm start
   ```

## Modes

Set the mode with the `GENERATOR_MODE` environment variable:

- `REALISTIC`: Generates logs over the last 6 days, with realistic day/night cycles and traffic peaks.
- `CURRENT_QUICK`: All logs use the current timestamp (with jitter).
- `CURRENT_SLOW`: Logs are spread over a configurable ingestion duration (default 60s), with timestamps distributed over that period.

## Environment Variables

| Variable           | Default         | Description                                                                 |
|--------------------|----------------|-----------------------------------------------------------------------------|
| `LOKI_URL`         | *(required)*   | URL of your Loki instance                                                   |
| `BASIC_AUTH`       | *(required)*   | Basic auth credentials for Loki (user:pass)                                 |
| `GENERATOR_MODE`   | `CURRENT_QUICK`| Log generation mode (`REALISTIC`, `CURRENT_QUICK`, `CURRENT_SLOW`)          |
| `MIN_LOGS`         | `100`          | Minimum number of logs to generate                                          |
| `MAX_LOGS`         | `120`          | Maximum number of logs to generate                                          |
| `HOST_COUNT`       | `6`            | Number of simulated hosts                                                   |
| `DB_CONNECTION_COUNT` | `5`         | Number of simulated DB connections                                          |
| `USER_COUNT`       | `500`          | Number of simulated users                                                   |
| `JOB_COUNT`        | `1`            | Number of jobs (distinct job labels)                                        |
| `JOB_NAME`         | `worker-node`  | Prefix for job names (e.g., `worker-node-1`, `worker-node-2`, ...)          |
| `SERVICE`          | `test-app`     | Service label for all logs                                                  |
| `ENVIRONMENT`      | `dev`          | Environment label for all logs                                              |
| `INGESTION_DURATION` | `60`         | (For `CURRENT_SLOW` mode) Duration (in seconds) to spread logs over         |

## Output

- Logs are sent to Loki in batches, each batch labeled with a random job name.
- All logs are also written to a local file in the `output/` directory.
- Console output summarizes batches, labels, and file size.

## Example

```bash
GENERATOR_MODE=REALISTIC JOB_COUNT=3 npm start
```

This will generate logs for 3 jobs, each batch labeled with a random job name.

---

## Troubleshooting

- If you see only one job label, ensure `JOB_COUNT` is set to a value greater than 1 in your `.env` file.
- All environment variable names are case-sensitive.
