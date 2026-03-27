import { InfluxDB } from "@influxdata/influxdb-client";

if (!process.env.INFLUX_URL) throw new Error("INFLUX_URL not set");
if (!process.env.INFLUX_TOKEN) throw new Error("INFLUX_TOKEN not set");
if (!process.env.INFLUX_ORG) throw new Error("INFLUX_ORG not set");
if (!process.env.INFLUX_BUCKET) throw new Error("INFLUX_BUCKET not set");

const client = new InfluxDB({
  url: process.env.INFLUX_URL,
  token: process.env.INFLUX_TOKEN,
});

const writeApi = client.getWriteApi(
  process.env.INFLUX_ORG,
  process.env.INFLUX_BUCKET,
  "ms",
);

const queryApi = client.getQueryApi(process.env.INFLUX_ORG);

process.on("SIGINT", async () => {
  await writeApi.close();
  console.log("[InfluxDB] Connection closed");
  process.exit(0);
});

export { writeApi, queryApi };
