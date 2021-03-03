# reCHORDing [WIP]

[Link](http://rechording.us-west-1.elasticbeanstalk.com)

reCHORDing is a tool for guitarist to quickly create chord diagrams with built in chord identification.
It is still a work in progress, but currently I have implemented the chord input diagram, chord identification, and a simplified form of cloud and local storage.

![preview](resources/rechording_2_20_21.gif)

### Config
Create a 'variables.env' file in the api dir, it should contain:

```js
DATABASE=database_uri

SALTROUNDS=10
JWT_KEY=jwt_key
```

### Start
Install the dependencies in the api folder and the client folder, and run ```npm run start``` in the api folder first on port 3000, and then in a different terminal run the same command in the client folder.
