import { writeApi } from './src/config/influx.js'
import { Point } from '@influxdata/influxdb-client'

// Write a test point
const testPoint = new Point('test')
  .tag('source', 'connection-test')
  .floatField('value', 1.0)

writeApi.writePoint(testPoint)
await writeApi.flush()
console.log('[InfluxDB] Test point written ✅')