## Install node modules
``npm install``

## Install the MongoDB database
``brew tap mongodb/brew``\
``brew update``\
``brew install mongodb-community@6.0``

## Store the MongoDB data's location to "<whoami>/mongodb"
``mongod --dbpath ~/mongodb``

## Load the MongoDB database
``node loadDatabase.js``

## Start the Node.js web server and build the Project
``npx nodemon webServer.js & npm run build:w``

---
#### If MongoDB not working correctly
``sudo killall -15 mongod``
#### If Node not working correctly
``sudo killall -9 node``
