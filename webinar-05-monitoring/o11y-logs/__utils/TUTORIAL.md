# Practical LogQL Exercises Using Your Logs

Below are 10 practical LogQL exercises based on your provided log file. Each exercise includes theory, a sample log from your data, a task, and a solution with explanation. All queries use a non-empty matcher (e.g., `host=~".+"`) as required by your Loki configuration.

---

## Exercise 1: Basic Log Stream Selection

**Theory:**  
LogQL stream selectors filter logs using labels. Your logs consistently use the `host` label, which is ideal for selection.

**Sample Log:**  
```json
{"timestamp":"2025-05-26T22:52:23.746Z","level":"info","eventType":"user","action":"login","message":"user login event","userId":"Merle.Lubowitz","duration":2344,"host":"sniveling-electronics.net"}
```

**Task:**  
Select all logs from the host `sniveling-electronics.net`.

**Solution:**  
```logql
{host="cuddly-wombat.com"}
```
**Explanation:**  
This selects all log entries where the `host` label matches exactly.

---

## Exercise 2: Filtering by Log Level

**Theory:**  
Use pipeline expressions to filter logs by values inside the log line, such as `level`.

**Sample Log:**  
```json
{"timestamp":"2025-05-26T22:52:23.747Z",...,"level":"error",...,"host":"sniveling-electronics.net"}
```

**Task:**  
Find all error-level logs from any host.

**Solution:**  
```logql
{host=~".+"} |= "level\":\"error\""
```
**Explanation:**  
The `|=` operator filters for lines containing `"level":"error"`. The selector matches all hosts.

---

## Exercise 3: JSON Parsing and Field Filtering

**Theory:**  
The `json` parser extracts fields from JSON logs for further filtering.

**Sample Log:**  
```json
{"timestamp":"2025-05-26T22:52:23.799Z","level":"info","eventType":"config","action":"update","message":"config update event","userId":"Deron.Johnston91","duration":3776,"host":"babyish-reorganisation.biz"}
```

**Task:**  
Find all config update events.

**Solution:**  
```logql
{host=~".+"} | json | eventType="config" and action="update"
```
**Explanation:**  
This parses JSON and filters for logs where `eventType` is "config" and `action` is "update".

---

## Exercise 4: Counting User Login Events

**Theory:**  
Use `count_over_time` to count events within a time window.

**Sample Log:**  
```json
{"timestamp":"2025-05-26T22:52:23.759Z","level":"info","eventType":"user","action":"login",...}
```

**Task:**  
Count user login events in the last 5 minutes.

**Solution:**  
```logql
{host=~".+"} | json | eventType="user" and action="login" | count_over_time([5m])
```
**Explanation:**  
Parses JSON, filters for user logins, and counts occurrences in a 5-minute window.

---

## Exercise 5: Average Duration of Logins

**Theory:**  
`unwrap` extracts numeric values for aggregation, such as average.

**Sample Log:**  
```json
{"timestamp":"2025-05-26T22:52:23.759Z","level":"info","eventType":"user","action":"login","duration":873,...}
```

**Task:**  
Calculate the average duration of user login events in the last 10 minutes.

**Solution:**  
```logql
{host=~".+"} | json | eventType="user" and action="login" | unwrap duration | avg_over_time([10m])
```
**Explanation:**  
Filters login events, extracts `duration`, and computes the average over 10 minutes.

---

## Exercise 6: Top Hosts by Error Events

**Theory:**  
`sum by` aggregates across label values. Useful for ranking.

**Sample Log:**  
```json
{"timestamp":"2025-05-26T22:52:23.800Z","level":"error",...,"host":"shallow-spirit.biz"}
```

**Task:**  
Find the top 3 hosts by number of error events in the last hour.

**Solution:**  
```logql
topk(3, sum by (host) (count_over_time({host=~".+"} | json | level="error" [1h])))
```
**Explanation:**  
Counts error events per host, then selects the top 3 hosts.

---

## Exercise 7: File Download Failures

**Theory:**  
You can filter logs for specific actions and status values.

**Sample Log:**  
```json
{"action":"download","fileName":"or_ouch_slather.rar","userId":"Darrion.Wilkinson","storage":"gcs","sizeBytes":3779624,"status":"failure","error":"...","level":"error","host":"shallow-spirit.biz"}
```

**Task:**  
List all failed file downloads.

**Solution:**  
```logql
{host=~".+"} | json | action="download" and status="failure"
```
**Explanation:**  
Filters for logs where `action` is "download" and `status` is "failure".

---

## Exercise 8: HTTP Error Rate Calculation

**Theory:**  
You can use `rate` and arithmetic to compute error rates for HTTP APIs.

**Sample Log:**  
```json
{"method":"GET","status":404,"url":"/v1/config/...","host":"sniveling-electronics.net",...}
```

**Task:**  
Calculate the error rate (status >= 400) for API requests on `sniveling-electronics.net` over the last 15 minutes.

**Solution:**  
```logql
sum(rate({host="sniveling-electronics.net"} | json | status >= 400 [15m]))
/
sum(rate({host="sniveling-electronics.net"} | json [15m]))
```
**Explanation:**  
Numerator counts error responses, denominator counts all requests, giving the error rate.

---

## Exercise 9: Longest Running SQL Operations

**Theory:**  
You can use `max_over_time` to find the maximum value of a field.

**Sample Log:**  
```json
{"timestamp":"2025-05-26T22:52:23.748Z","operation":"INSERT","table":"payments",...,"duration":439,...}
```

**Task:**  
Find the maximum duration of any SQL operation on `shallow-spirit.biz` in the last 30 minutes.

**Solution:**  
```logql
{host="shallow-spirit.biz"} | json | unwrap duration | max_over_time([30m])
```
**Explanation:**  
Filters for the host, extracts `duration`, and finds the max over 30 minutes.

---

## Exercise 10: Custom Output Formatting for User Signups

**Theory:**  
`line_format` allows you to customize output for better readability.

**Sample Log:**  
```json
{"timestamp":"2025-05-26T22:52:24.006Z","level":"warn","eventType":"user","action":"signup","message":"user signup event","userId":"Keshawn_McDermott87","duration":3365,"host":"shallow-spirit.biz"}
```

**Task:**  
Show all user signup events with output:  
`User {{userId}} signed up on {{host}} (duration: {{duration}}ms)`

**Solution:**  
```logql
{host=~".+"} | json | eventType="user" and action="signup" | line_format "User {{.userId}} signed up on {{.host}} (duration: {{.duration}}ms)"
```
**Explanation:**  
Parses JSON, filters for signups, and formats the output as specified.

---

## Notes

- **Always use a non-empty matcher in the selector, e.g., `host=~".+"` or `host="..."`.**
- **Adjust label values as needed for your environment.**
- **For metric queries, ensure your Loki is configured to support them and that the relevant fields are numeric.**
