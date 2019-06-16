const form = document.getElementById('vote-form');
// Form submit
form.addEventListener('submit', (e) => {
    const choice = document.querySelector('input[name = os]:checked').value
    const data = {os: choice}

    fetch('api/poll', {
        method:'post',
        body:JSON.stringify(data),
        headers: new Headers({
            'Content-Type' : 'application/json'
        })
    })
      .then(res => res.json())
      .then(data => console.log(data))
      .catch(err => console.log(err));

    
    e.preventDefault();
})


fetch('api/poll')
.then(res => res.json())
.then(data => {
  const votes = data.votes;
  const totalvotes = votes.length;
  // Count vote points - acc/current
  const voteCounts = votes.reduce((acc, vote) =>
   (acc[vote.os] = (
     (acc[vote.os] || 0) + parseInt(vote.points)), acc), {});

     let dataPoints =  [
      { label: "MacOS",  y: voteCounts.Windows },
      { label: "Windows", y: voteCounts.MacOS },
      { label: "LinuxDistro", y: voteCounts.LinuxDistro },
      { label: "Others",  y: voteCounts.Others}
    ]
    
    const chartContainer = document.querySelector('#chartContainer');
    if(chartContainer) {
    var chart = new CanvasJS.Chart("chartContainer", {
          theme: "light2", // "light2", "dark1", "dark2"
          animationEnabled: true, // change to true		
          title:{
          text: `Total votes ${totalvotes}`
                  },
        data: [
       {
    // Change type to "bar", "area", "spline", "pie",etc.
      type: "column",
      dataPoints: dataPoints                    }
        ]
    });
    chart.render();
    }
    
     // Enable pusher logging - don't include this in production
     Pusher.logToConsole = true;
    
     var pusher = new Pusher('1663376eb3dc9e9ea1cf', {
       cluster: 'ap2',
       forceTLS: true
     });
    
     var channel = pusher.subscribe('os-poll');
     channel.bind('os-vote', function(data) {
        dataPoints = dataPoints.map( x => {
          if(x.label == data.os) {
            x.y  += data.points;
            return x;
          }
          else {
            return x;
          }
        });
        chart.render();
     });
        

});

