import { queryApi } from "../config/influx.js";

const getLatestTelemetry = async () => {
  return await queryApi.collectRows(`
    from(bucket: "${process.env.INFLUX_BUCKET}")
      |> range(start: -5m)
      |> last()
  `);
};

const getTelemetryHistory = async (minutes = 10) => {
  return await queryApi.collectRows(`
    from(bucket: "${process.env.INFLUX_BUCKET}")
      |> range(start: -${minutes}m)
  `);
};

export { getLatestTelemetry, getTelemetryHistory };
