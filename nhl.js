const https = require('https'),
 cp = require("child_process"),
 moment = require('moment');

var startDate = "09/21/2018";
 endDate = "09/23/2018",
 gamePk = "2018010048",
 //url = 'https://statsapi.web.nhl.com/api/v1/schedule?gamePk='+gamePk+'&startDate='+startDate+'&endDate='+endDate+'&expand=schedule.teams,schedule.linescore';
 url = 'https://statsapi.web.nhl.com/api/v1/game/'+gamePk+'/feed/live',
 currentHomeScore = 0,
 currentAwayScore = 0,
 justStarted = true;

 setInterval(function() {
 	apiRequest(url);
 }, 1500);

setTimeout(function(){
	GOAL(true);
}, 5000);

 function GOAL(isHomeTeam) {
	if(isHomeTeam){
	  console.log("GOAL!!!  GOAL!!!  GOAL!!!", currentHomeScore, ":", currentAwayScore);
	  cp.exec("goal.exe");
	  cp.exec("cmdmp3win.exe 2018blackhawks.mp3", function(err){
		if (err) throw err
	  });
 	}
 	//play goal horn and run lights
 }

 function updateData(data) {
 var liveData = data.liveData,
  boxScore = liveData.boxscore,
  home = boxScore.teams.home,
  away = boxScore.teams.away,
  homeGoals = parseInt(home.teamStats.teamSkaterStats.goals),
  awayGoals = parseInt(away.teamStats.teamSkaterStats.goals),
  startTime = moment(data.gameData.datetime.dateTime).fromNow();
 console.log(data.gameData.status.detailedState + " starts " + startTime);
 console.log("TIMESTAMP:", new Date());
 console.log(home.team.name, homeGoals);
 console.log(away.team.name, awayGoals);
 console.log();
 if (currentHomeScore != homeGoals && currentAwayScore != awayGoals) {
  //Glitch because why did both scores change at the same time. No false alarm.
  currentHomeScore = homeGoals;//Set first scores if first run
  currentAwayScore = awayGoals;//Set first scores if first run
 }
 if(currentHomeScore != homeGoals){
  currentHomeScore = homeGoals;
  return GOAL(true);
 }
 if(currentAwayScore != awayGoals){
  currentAwayScore = awayGoals;
  return GOAL(false);
 }
 }

 function apiRequest(url){
 https.get(url, (resp) => {
 console.log("Requesting:", url);
 let data = '';
 // A chunk of data has been recieved.
 resp.on('data', (chunk) => {
 data += chunk;
 });
 // The whole response has been received. Print out the result.
 resp.on('end', () => {
 data = JSON.parse(data);
 if (data) {
  updateData(data);
 }else{
  console.log("ERROR", data);
 }
 });
 }).on("error", (err) => {
 console.log("Error: " + err.message);
 });
 }