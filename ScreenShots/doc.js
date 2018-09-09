
var fs = require('fs');
var http = require('http');
var path = require('path');
var basePath = __dirname;

// Replaces all white space in all filenames of this folder.
(function removeSpaces(){
	var fname = fs.readdirSync('./');
	for (i = 0; i < fname.length; i++) {
	    if(fname[i] !== 'doc.js') {
	        if(fname[i].charAt(0) !== '.') {
		    fs.rename(fname[i], fname[i].replace(/\s+/g, "-"), function (err) {
		        if (err) {
			    console.log(err);
			    return; 
		        }});
		}
	    }
	}
	console.log('Removing Spaces from filenames in this folder......');
	setTimeout(function(){console.log('Starting Server...................\n..................................');},2000);
	setTimeout(function(){startServer();},3000);
})();

function rdfile() {
	// Set the Image size here, "auto" in width or height will keep the images aspect ratio locked.
	var  width = '800px', height = 'auto';
	var loc = fs.readdirSync('./');
	var htmlOutput = "";
	for (i = 0; i < loc.length; i++) {
	    if(loc[i] !== 'doc.js') {
		if(loc[i].charAt(0) !== '.') {
		    // Using the WYSIWYG editor: "PageEdit" in Google Chrome, a paragraph will be added between images
		    // if the below html line starts with a "<br>" tag. Uncomment it if that is the desired behavior.
		    var htmlOutput = htmlOutput + '<!--br--><div id="id' + [i] + '" class="img-wrappers">\n<img src="' + loc[i] + '" alt="Screen-Shot-' + [i] + '" style="width:' + width + ';height:' + height + ';" />\n</div>\n';
		}
	    }
	}
	return htmlOutput;
};

function startServer() {
	var htmlOutput = rdfile();
	http.createServer(function(req, res) {
	    var stream = fs.createReadStream(path.join(basePath, req.url));
	    stream.on('error', function() {
		// The html document properties can be customized with html/css here.
		// Edit any HTML page in Chrome with this powerful WYSIWYG editor
		// Get "PageEdit" WYSIWYG editor:  https://chrome.google.com/webstore/detail/pageedit/ebkclgoaabaibghklgknnjdemknjaeic?utm_source=chrome-ntp-icon
	        res.write('<!DOCTYPE html>\n<html>\n<head>\n<title>Doc</title>\n<style>\nbody {margin: 0 auto; max-width: 808px; font-family: Arial,"Helvetica Neue",Helvetica,sans-serif; font-size: 12pt;} \np {text-indent: 2em;}\n.img-wrappers   { /*border: solid black 1px;*/ /*font-style: italic;*/}\n</style>\n</head>\n<body>\n' + htmlOutput + '</body>\n</html>\n');
	        res.end();
	    });
	    stream.pipe(res);
	}).listen(3000);
	console.log('Live on http://localhost:3000/ ');
	console.log('## Press: Ctrl-C to stop server ##');
};
