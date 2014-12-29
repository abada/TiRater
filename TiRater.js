 //-- usage
 /*
 $.index.addEventListener("open", function(e) {
  		var  rater = require('TiRater');
     rater.initMe(Titanium.App.name,Titanium.App.id);
 
});*/
/*
* Our Rater CommonJS Module
*/
var Rater ={ 
     appName : '',
	 appId: '',
	 appLaunches : 3,
	 appUsageInSeconds : 0 // 0 if you don't want to use this
};

 

Rater.data = {
	launchCount : 0,
	timeUsed : 0,
	neverRemind : false
};

Rater.startUsageTimer = function() {
	var _this = this;
	Rater.usageTimerInterval = setInterval(function() {
		_this.data.timeUsed += 1;

		// Debugging
		// Ti.API.info(Rater.data.timeUsed + " seconds of app usage");

		// Check if the desired usage time has been reached
		if (_this.data.timeUsed === _this.appUsageInSeconds) {
			// Pause the timer
			_this.pauseUsageTimer();
			// Open the rating dialog
			_this.openRateDialog();
		}
	}, 1000);
};

Rater.pauseUsageTimer = function() {
	var _this = this;
	clearInterval(_this.usageTimerInterval);
};

Rater.initUsageCounter = function() {
	var _this = this;
	// Check if the user wants to use this feature
	if (_this.appUsageInSeconds > 0) {
		_this.startUsageTimer();
	}
};

Rater.load = function() {
	var _this = this;
	// Read the data
	_this.read();

	// Increase the launch count
	_this.data.launchCount += 1;

	// Init the usage counter
	_this.initUsageCounter();

	// Save the data
	_this.save();
};

Rater.read = function() {
	var _this = this;
	var prop = Ti.App.Properties.getString("RaterData", null);
	if (prop) {
		_this.data = JSON.parse(prop);
	}
};

Rater.save = function() {
	
	var _this = this;
	Ti.App.Properties.setString("RaterData", JSON.stringify(_this.data));
};

Rater.run = function() {
	
	var _this = this;
	//console.log('Rater run '+_this.data.neverRemind +' : '+_this.data.launchCount +' : '+_this.appLaunches);
	//console.log(' % '+_this.data.launchCount % _this.appLaunches);
	if (_this.data.neverRemind || _this.data.launchCount % _this.appLaunches !== 0) {
	 	return;
	}

	_this.openRateDialog();
};

Rater.openRateDialog = function() {
	console.log('openRateDialog ......................');
	var _this = this;
	var a = Ti.UI.createAlertDialog({
		title :"Feedback",
		message : String.format("Thank you for using %s, it would mean a lot to us if you took a minute to rate us at the App Store!", _this.appName),
		buttonNames : ["Rate now", "Don't remind me again", "Not now"],
		cancel : 2
	});

	a.addEventListener('click', function(e) {
		switch(e.index) {
			case 0 :
				// rate
				_this.data.neverRemind = true;
				_this.save();

				// detect android device
				if (OS_ANDROID) {
					Ti.Platform.openURL("market://details?id=" + _this.appId);

					// detect iphone and ipad devices
				} else {
					Ti.Platform.openURL("itms-apps://itunes.apple.com/app/id=" + _this.appId);
				}

				break;
			case 1 :
				// don't remind
				_this.data.neverRemind = true;
				_this.save();
				break;
		}
	});
	a.show();
};

Rater.init = function(appName, appId) {
	console.log('Rater init '+appName + ' : '+appId);
	var _this = this;
	_this.load();

	// Set the default values
	_this.appName = appName;
	_this.appId = appId;

	_this.run();

	_this.save();
	_this.read();	
};

 exports.initMe=function (appName, appId){
 	Rater.init(appName, appId);
 };
 
 
  