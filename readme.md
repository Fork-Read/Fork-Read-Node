# Fork-Read-Node
Its is a nodejs application for the backend structure of book discovery network. For setup on localhost please refer the following documentation:

### Installation on OS X
* Install homebrew on mac [HomeBrew](http://brew.sh/)
* Install mongodb through brew using the command `brew install mongodb` or refer to the [MongoDb Documentation](http://docs.mongodb.org/manual/tutorial/install-mongodb-on-os-x/)
* Install elasticsearch through brew using command `brew install elasticsearch`
* Install [NodeJS](https://nodejs.org/)
* Run ```sudo chown -R `whoami` /usr/local/lib/node_modules``` to change the file permissions for global node_modules directory
* Install express `npm install -g express` and express command line tools `npm install -g express-generator` globally
* Go inside the Fork-Read-Node directory and do `npm install`. This would install all the modules required for running the application
* Start elasticsearch `elasticsearch start` and mongodb server `sudo mongod`
* Inside the Fork-Read-Node folder run the command `npm start`

You would see something like
```
> Fork-Read-Node@0.0.0 start <Path to your code directory>
> node ./bin/www

Elasticsearch INFO: 2015-03-13T17:37:13Z
  Adding connection to http://localhost:9200/

Succeeded connected to: mongodb://localhost:27017/snickers
```