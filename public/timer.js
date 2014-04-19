// Different browsers have different accuracies.
// Hopefully yours doesn't suck enough to use the low performance timer.
var Timer = function(duration) {
    if (window.performance.now) {
        console.log("Using high performance timer");
        this.getTimeStamp = function() { return window.performance.now();};
        
    } else if (window.performance.webkitNow) {
        console.log("Using webkit high performance timer");
        this.getTimeStamp = function() { return window.performance.webkitNow(); };
        
    } else {
        console.log("Using low performance timer");
        this.getTimeStamp = function() { return new Date().getTime(); };
        
    }
    
    this.startTime = 0;
    this.endTime = 0;
    this.timeRemaining = 0;
    this.duration = duration; // milliseconds
}

Timer.prototype.start = function() {
    this.startTime = this.getTimeStamp();
    
}

Timer.prototype.getTimeRemaining = function() {
    if (this.startTime == null)
        return -1;
    
    this.endTime = this.getTimeStamp();
    
    this.timeRemaining = this.duration - (this.endTime - this.startTime);
    
    if (this.timeRemaining < 0)
        this.timeRemaining = 0;
    
    return Math.ceil(this.timeRemaining / 1000);
}