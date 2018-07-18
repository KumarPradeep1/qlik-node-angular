const path = require('path');
const nodemon = require('nodemon');
const express = require('express');
const app = express();
const qsocks = require('qsocks');

var objects_info = [];
// let skip_object_types = ["slide", "slideitem", "story","sheet", "filterpane", "listbox", "snapshot", "embeddedsnapshot"];
let required_objects = ["kpi","barchart","combochart", "linechart","table"];


let qlik_app = ""
let HyperCubeDefParams = [{
    qTop: 0,
    qLeft: 0,
    qWidth: 10,
    qHeight: 100
    }]

// let config = {
//   host: 'qlik.mashey.com',
//   isSecure: true,
//   prefix:'hdr',
//   appname: appid,
//   headers: {
//   'Content-Type':'application/json',
//   'x-qlik-xrfkey' : 'abcdefghijklmnop',
//   'hdr-usr': 'MASHEY\\andrew'
//   }
// }

function auth_params(appid){
  let config = {
    host: 'sense-demo.qlik.com',
    isSecure: true,
    prefix:'',
    appname: appid
  };
  return config
}

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.listen(3005, () => {
  console.log('listening on 3005'+__dirname);
});

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html');
});

// Get Qlik app raw data for all elements
app.get('/appinfo/:appId', (req, res) => {
  config = auth_params(req.params.appId)
	qsocks.ConnectOpenApp(config)
  .then(function(connections) {
  	qlik_app = connections[1];
    return qlik_app.getAllInfos()
	})
	.then(function(allinfos) {
    qInfos = allinfos.qInfos;
  	return elements_info(qInfos);
	})
	.then(function(elements){
  	var promises = elements.map(element => {

    	return new Promise((resolve, reject) => { 
      	let title, info, headdata,tableproperty;
      	info = {id: element.qId, type: element.qType}

        qlik_app.getObject(info.id).then(object => {
      		if(info.type == 'table'){
      			object.getLayout().then(function(tableproperty) { 
      				info["tableproperty"] = tableproperty;
      			});
      		}

      		object.getEffectiveProperties().then(function(property) {
            if(property.qHyperCubeDef.qDimensions)
      			  headdata = property.qHyperCubeDef.qDimensions;

      			if(property.title){
      				title = property.title
      			}else if(property.qHyperCubeDef.qMeasures[0].qDef.qLabel){
      				title = property.qHyperCubeDef.qMeasures[0].qDef.qLabel
      			}else{
      				title = null;
      			}

      			info["title"] = title;
      			objects_info.push(info);
      		});

      		object.getHyperCubeData('/qHyperCubeDef', HyperCubeDefParams)
          .then(function(data) {
      			info["data"] = data[0].qMatrix
      			objects_info.push(info)
      			resolve(info);
      		});
      	})
    	})
  	});

  	Promise.all(promises).then(function(values){
      result = {}
      result[appid] = values
  	  res.send(result);
  	});
	})
	.catch(function(err) {
	  console.log('Something went wrong: ', err);
    response = {error: err}
    res.send(response);
	})
});

// Get all Docs list
app.get('/doclists', (req, res) => {
  config = auth_params("aaaaa")
  qsocks.ConnectOpenApp(config)
  .then(function(connections) {
    var global = connections[0];
    qlik_app = connections[1];
    global.getDocList().then(function(doclist) {
        res.send(doclist);
    });
  })
  .catch(function(err) {
    console.log('Something went wrong: ', err);
    response = {error: err}
    res.send(response);
  })
});

function elements_info(data){
  let elements= [];
  data.forEach(function(element){
    if (required_objects.includes(element.qType))
      elements.push({ qType: element.qType, qId: element.qId  })
  });
  return elements;
}
