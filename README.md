# Metric Aggregator Exercise

## Install

```
npm install
```

## Run the server

```
npm start
```

## API

### POST metric

*Request*
```
POST /metric/{key}
{
  ​"value"​: ​30
}
```

*Response (200)*
```
{}
```

### GET metric sum
Returns the sum of all metrics reported for this key over the past hour

*Request*
```
GET /metric/{key}/sum
```

*Response (200)*
```
{
  "value": 400
}
```

## Examples

```
// 2 hours ago **
POST /metric/active_visitors { ​"value"​ = ​4​ }

// 30 minutes ago
POST /metric/active_visitors { ​"value"​ = ​3​ }

// 40 seconds ago
POST /metric/active_visitors { ​"value"​ = ​7​ }

// 5 seconds ago
POST /metric/active_visitors { ​"value"​ = ​2​ }
```

These are the results expected from calling get aggregates:

```
GET /metric/active_visitors/sum ​// returns 12
```

** Note that the metric posted 2 hours ago is not included in the sum since we only care about data in the most recent hour for these APIs.

## Run the tests

```
npm test
```
