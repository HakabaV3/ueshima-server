# ueshima-server

## API

- エントリーポイントは`http://ueshima.hakaba.xyz/api/v1`
- `POST /user`、`POST /auth`以外のリクエストに必ずトークンを付与する
- トークンのキーは`X-Session-Token`

## Auth

GET /auth/me  
POST /auth  
DELETE /auth

### GET /auth/me

### `response`

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

### POST /auth

#### `request`

- query

```
?name=kikurage&password=kikurage_password
```

#### `response`

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

### DELETE /auth

#### `response`

```
{
    "status": 200,
    "result": {}
}
```

## User

POST /user

### POST /user

#### `request`

- query

```
?name=kikurage
```

#### `response`

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

#### `response`

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
				"guests": [
					"jinssk",
					"susaki"
				],
				"board": [
					0,
					0,
					0,
					...
					-1,
					1,
					0
				],
				"turn": "kikurage",
				"created": 12345678,
				"updated": 12345678,
				"moves": [
					{
						"x": 6,
						"y": 4,
						"created": 1234567890,
						"player": "dooor",
						"playerId": "dooor_id"
					}
				],
				"points": [
                    53,
                    64,
                    35,
                    46
                ],
				"chats": [
					{
						"player": "jinssk",
						"playerId": "jinssk_id",
						"text": "dooorがんばれ！",
						"created": 1234567890
					}
				]
			},
			{
				"id": "r2984yr9284yhg",
				"players": [
					"kikurage",
					"dooor"
				],
				"guests": [
					"jinssk",
					"susaki",
				],
				"board": [盤面の状態],
				"turn": "kikurage",
				"created": 12345678,
				"updated": 12345678,
				"moves": [Moveの配列],
				"points": [石の置けるindexの配列],
				"chats": [Chatの配列]
			},
			...
			{
				"id": "r2984yr9284yhg",
				"players": [
					"kikurage",
					"dooor"
				],
				"guests": [
					"jinssk",
					"susaki",
				],
				"board": [盤面の状態],
				"turn": "kikurage",
				"created": 12345678,
				"updated": 12345678,
				"moves": [Moveの配列],
				"points": [石の置けるindexの配列],
				"chats": [Chatの配列]
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
			"guests": [],
			"board": [
				0,
				0,
				0,
				...
				0,
				0,
				0
			],
			"turn": "kikurage",
			"created": 12345678,
			"updated": 12345678,
			"moves": [],
			"points": [石の置けるindexの配列],
			"chats": []
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
			"guests": [
				"jinssk",
				"susaki"
			],
			"board": [
				0,
				0,
				0,
				...
				-1,
				1,
				0
			],
			"turn": "kikurage",
			"created": 12345678,
			"updated": 12345678,
			"moves": [
				{
					"x": 6,
					"y": 4,
					"created": 1234567890,
					"player": "dooor",
					"playerId": "dooor_id"
				}
			],
			"points": [石の置けるindexの配列],
			"chats": [
				{
					"player": "jinssk",
					"playerId": "jinssk_id",
					"text": "dooorがんばれ！",
					"created": 1234567890
				}
			]
		}
	}
}
```

## Invitation

### POST /game/:gameId/invitation

#### `request`

- query

```
?name=susaki
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
			"guests": [
				"jinssk",
				"susaki"
			],
			"board": [
				0,
				0,
				0,
				...
				-1,
				1,
				0
			],
			"turn": "kikurage",
			"created": 12345678,
			"updated": 12345678,
			"moves": [
				{
					"x": 6,
					"y": 4,
					"created": 1234567890,
					"player": "dooor",
					"playerId": "dooor_id"
				}
			],
			"points": [石の置けるindexの配列],
			"chats": [
				{
					"player": "jinssk",
					"playerId": "jinssk_id",
					"text": "dooorがんばれ！",
					"created": 1234567890
				}
			]
		}
	}
}
```

