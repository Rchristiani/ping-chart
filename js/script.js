(function() {
	var APP = {};

	APP.socket = io.connect('http://localhost:3000');

	APP.startBtn = document.querySelector('.start');
	APP.endBtn = document.querySelector('.end');

	APP.pings = {
		//Needs to be max and min time?
		labels: [],
		datasets: [
			{
				label: "Ping",
				fillColor: "rgba(220,111,110,0.2)",
	            strokeColor: "rgba(220,48,53,1.0)",
	            pointColor: "rgba(220,15,43,1.0)",
	            pointStrokeColor: "#fff",
	            pointHighlightFill: "#fff",
	            pointHighlightStroke: "rgba(220,220,220,1)",
				data: []
			}
		]
	};

 	APP.events = function() {
 		var self = this;
 		var chartMade = false;
 		var index = 0;
		this.socket.on('ping', function(data) {
			data.time = data.time.slice(5);
			APP.pings.labels.push(index);
			APP.pings.datasets[0].data.push(data.time);
			if(!chartMade) {
				APP.chart.create();
			}
			else {
				APP.chart.update();
			}
			index++;
		});
		
		this.startBtn.addEventListener('click', function() {
			self.socket.emit('start');
		});

		this.endBtn.addEventListener('click', function() {
			self.socket.emit('end');
		});
 	};

 	APP.chart = {
 		ctx: document.getElementById('chart').getContext('2d'),
 		create: function() {
 			var self = this;
 			this.chart = new Chart(self.ctx).Line(APP.pings)


 		},
 		update: function() {
 			this.chart.update();
 		}
 	};

 	APP.init = function() {
 		this.events();
 	};

 	APP.init();

})();