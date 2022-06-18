## Endpoints

### Get All Documents from Collection
GET https://example.com/:collectionName

### Get Document by ID from Collection
GET https://example.com/:collectionName/:id

### Search Documents from Collection
POST https://example.com/:collectionName/search

### Create new Document
POST https://example.com/:collectionName/create

### Update Document
PATCH https://example.com/:collectionName/update/:id

### Delete Document
DELETE https://example.com/:collectionName/delete/:id

## Setup an Auth0 Account

You'll need an Auth0 account to add authentication to the API. Alternatively you could replace the code with another authentication provider.

## Important

This is an example API for single user per tenant setups. Each inserted mongodb document is given a tenantId field set to the users ID and is filtered when you get the documents, update, or delete a document.

To update fields in a document you only need to send the fields you are changing as you would with a mongodb.updateOne( $set ).

## Create Envirnoment Variables

```console
cp example.env .env
```

or if you plan on using docker-compose
```console
cp example.env api.env
```

Edit the new **.env** file and replace the connection string, database name, cors domains, and Auth0 details.

## Build

```
npm run build
```

## Run in development (uses nodemon)

```
npm run start:dev
```

## Run in production

```
npm start
```

## Docker

An example docker-compose file is included. 

To create the docker image run:

```
docker build -t myorg/mongodb-rest-api .
```
*Make sure to include the dot at the end.*

Update the docker-compose.yml file to change myorg to whatever you set as the org name and the name of the .env file if you did not name it api.env. Then run:

```
docker-compose up -d
```
