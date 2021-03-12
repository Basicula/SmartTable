var colors = [];
var curr_color = 0;
const refine_cnt = 100;

function color_to_hex(color) {
    var hex = "#";
    for (let i = 0; i < 3; ++i)
        hex += ("00" + color[i].toString(16)).substr(-2);
    hex += "cc"
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
    var color1 = Math.round(curr_color);
    var color2 = color1 + refine_cnt;
    color2 %= colors.length;
    color1 %= colors.length;
    var gradient = `radial-gradient(${color_to_hex(colors[color1])}, ${color_to_hex(colors[color2])})`;
    //console.log(gradient);
    $(".welcome-text").css({
        background: gradient
    });
    ++curr_color;
}

$(document).ready(function(){
    colors.push([0x00, 0xff, 0x00]);
    colors.push([0x00, 0x00, 0xff]);
    colors.push([0xff, 0x00, 0x00]);
    refine_colors();
    setInterval(function() {update();}, 100);
});