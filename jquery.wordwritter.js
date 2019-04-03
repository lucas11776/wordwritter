/**
 * WordWritter
 * Apply time effect to text element 
 * 
 * Developer Themba Lucas Ngubeni 
 *
 * @Requered Waypoint.js
 * 
 * @version 1.0
 * @copyright http://themba.website
 * @github http://github.com/lucas11776/wordwritter
*/
(function($){
    
    var setting = {
        time  : 2000, 
        start : 2000, 
        pause : 2000, 
        loop  : 0, 
        offset: '70%'
    };

    /**
     * Apply typing/writting effect to element
     * 
     * @param {object} options        - options to apply to effect
     * @param {number} options.time   - time taken to complete animation
     * @param {number} options.start  - time taken before animation start
     * @param {number} options.pause  - time taken before out animation start
     * @param {number} options.loop   - number of times to repeat animation
     * @param {number} options.offset - point at which animation should start
    */
    $.fn.wordwritter = function(options){
        
        setting = $.fn.extend(setting, options);
        
        // check if time not less then 1 second 
        if(setting.time < 1000){
            setting.time = 1000;
        }
        
        return this.each(function(){
            var scope = this;
            var animation = $(scope).writterAnimate();
            var waypoint;
            
            // check if waypoint is avaible
            try{
                waypoint = new Waypoint({
                    element: scope,
                    handler: function(direction){
                        if(direction == 'down') start();
                        if(direction == 'up') pause();
                    },
                    offset: setting.offset
                });
            }catch(error){
                animation.start();
            }
            
            function start(){
                animation.start();
            }
            
            function pause(){
                animation.pause();
            }
            
            function end(){
                animation.end();
            }
        });
        
    };
    
    $.fn.writterAnimate = function(){
        
        if(this.length > 1){
           return this.each(function(){
               $(this).writterAnimate();
           });
        }
        
        // currecnt element to animate
        var scope = this;
        
        // HTMLElement jQuery selector
        var elem = $(this);
        
        // get element html for end animation
        var html = elem.html();
        
        // convert string to array
        var list = ($(scope).text()).split('');
        
        // time taken to write each element in list
        var animateTime = ((setting.time/2)/(list.length));
        
        // interval
        var interval;
        
        // timeOut
        var timeOut;
        
        // number of time looped
        var loop = 0;
        
        // current animated element
        var currentItem = 0;
        
        // start animation
        scope.start = function(){
            if(repeat()){
                timeOut = setTimeout(function(){
                    clearTimeout(timeOut);
                    elem.html('');
                    interval = setInterval(forward, animateTime);
                }, setting.start);
            }
        };
        
        // pause animation
        scope.pause = function(){
            end();  
        };
        
        // add charactor in element
        var forward = function(){
            elem.append(list[currentItem]);
            currentItem++;
            if(currentItem == list.length){
                clearInterval(interval);
                timeOut = setTimeout(function(){
                    clearTimeout(timeOut);
                    interval = setInterval(back, animateTime);
                }, setting.pause);
            }
        };
        
        // remove charactor in element
        var back = function(){
            var text = list.slice(0, currentItem);
            elem.html(text);
            currentItem--;
            if(currentItem < 0){
                clearInterval(interval);
                currentItem = 0;
                loop++;
                if(!repeat()){
                    end();
                }else{
                    interval = setInterval(forward, animateTime);
                }
            }
        };
        
        // check if repeat limit is meant
        var repeat = function(){
            if(setting.loop > 0){
                if(loop == setting.loop){
                    return false;
                }
            }
            return true;
        };
        
        // end animation
        var end = function(){
            clearInterval(interval);
            clearTimeout(timeOut);
            elem.html(html);
            currentItem = 0;
        };
        
        return scope;
    };
    
}(jQuery))
