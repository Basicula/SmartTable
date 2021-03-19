var colors = [];
var curr_color = 0;
const refine_cnt = 100;

var background_animation = false;
const default_background = "radial-gradient(rgba(255, 255, 0, 0.667), rgba(255, 0, 0, 0.667))";

function color_to_hex(color) {
    var hex = "#";
    for (let i = 0; i < 3; ++i)
        hex += ("00" + color[i].toString(16)).substr(-2);
    hex += "aa"
    return hex;
}

function refine_colors() {
    var refined_colors = [];
    for (let i = 0; i < colors.length; ++i) {
        refined_colors.push(colors[i]);
        for (let j = 0; j < refine_cnt; ++j) {
            var new_color = [];
            for (let k = 0; k < 3; ++k) {
                new_color.push(Math.floor(colors[i][k] * (refine_cnt - j) / refine_cnt + colors[(i + 1) % colors.length][k] * j / refine_cnt));
            }
            refined_colors.push(new_color);
        }
    }
    colors = refined_colors;
}

function update() {
    if (!background_animation) {
        $(".welcome").css({
            background: default_background
        });
        return;
    }
    var color1 = Math.round(curr_color);
    var color2 = color1 + refine_cnt;
    color2 %= colors.length;
    color1 %= colors.length;
    var gradient = `radial-gradient(${color_to_hex(colors[color2])}, ${color_to_hex(colors[color1])})`;
    $(".welcome").css({
        background: gradient
    });
    ++curr_color;
}

$(document).ready(function(){
    colors.push([0x00, 0xff, 0x00]);
    colors.push([0x00, 0xff, 0xff]);
    colors.push([0x00, 0x00, 0xff]);
    colors.push([0xff, 0x00, 0xff]);
    colors.push([0xff, 0x00, 0x00]);
    colors.push([0xff, 0xff, 0x00]);
    refine_colors();
    setInterval(function() {update();}, 100);
});

$(document).keydown(function(e){
    if (e.keyCode === 65 && e.ctrlKey && e.altKey) {
        background_animation = !background_animation;
    }
});