TiRater  CommonJS Module ![alt tag](http://www-static.appcelerator.com/badges/titanium-git-badge-sq.png)
=======

Rating module for titanium platform, the module work both Android and iOS

 //-- Usage 
 
 # 1- Copy TiRater.js to app name /app/lib folder
 # 2- 
 
 $.index.addEventListener("open", function(e) {
 
  	 var  rater = require('TiRater');
     rater.initMe(Titanium.App.name,Titanium.App.id);
 
}); 


The Original module is https://github.com/raulriera/Rater-Module/

