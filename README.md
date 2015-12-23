# ueshima-server

## API

- エントリーポイントは`/api/v1`
- `POST /user`以外のリクエストに必ずトークンを付与する
- トークンのキーは`X-Session-Token`

## User

POST /user

### POST /user

#### request

- query

```
?name=kikurage
```

#### response

```
{
    "status": 200,
    "result": {
    	"user": {
    		"id": "dlfajoeij0489u20",
    		"name": "kikurage",
    		"token": "93814h523nrfewjnr0293u"
    		"created": 12345678,
    		"updated": 12345678
    	}
    }
}
```

## Game

GET /game  
POST /game

### GET /game

```
{
	"status": 200,
	"result": {
		"games": [
			{
				"id": "r2984yr9284yhg",
				"players": [
					"kikurage",
					"dooor"
				],
				"turn": "kikurage",
				"created": 12345678,
				"updated": 12345678,
				"moves": [Moveの配列]
			},
			{
				"id": "r2984yr9284yhg",
				"players": [
					"kikurage",
					"dooor"
				],
				"turn": "kikurage",
				"created": 12345678,
				"updated": 12345678,
				"moves": [Moveの配列]
			},
			...
			{
				"id": "r2984yr9284yhg",
				"players": [
					"kikurage",
					"dooor"
				],
				"turn": "kikurage",
				"created": 12345678,
				"updated": 12345678,
				"moves": [Moveの配列]
			}
		]
	}
}
```

### POST /game

#### `request`

- query

```
?name=dooor
```

#### `response`


```
{
	"status": 200,
	"result": {
		"game": {
			"id": "r2984yr9284yhg",
			"players": [
				"kikurage",
				"dooor"
			],
			"turn": "kikurage",
			"created": 12345678,
			"updated": 12345678,
			"moves": []
		}
	}
}
```

## Move

### POST /game/:gameId/move

#### `request`

- query

```
?x=1&y=1
```

#### `response`

```
{
	"status": 200,
	"result": {
		"game": {
			"id": "r2984yr9284yhg",
			"players": [
				"kikurage",
				"dooor"
			],
			"turn": "kikurage",
			"created": 12345678,
			"updated": 12345678,
			"moves": [Moveの配列]
		}
	}
}
```
