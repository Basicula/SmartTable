$(document).ready(function(){
    $(".draggable").each(function() {
        var downX, downY;
        var ismove = false;

        function onMouseDown(e) {
            downX = e.clientX;
            downY = e.clientY;
            ismove = true;
        }

        function onMouseMove(e) {
            if (!ismove)
                return;

            var newX = downX - e.clientX;
            var newY = downY - e.clientY;

            this.style.left = this.offsetLeft - newX + 'px';
            this.style.top = this.offsetTop - newY + 'px';

            downX = e.clientX;
            downY = e.clientY;
        }

        function onMouseUp(e) {
            ismove = false
        }

        this.onmousemove = onMouseMove;
        this.onmouseup = onMouseUp;
        this.onmousedown = onMouseDown;  
    });
});
  