function random(min, max) {
    return min + Math.floor((max - min) * Math.random());
}

function rand(max) {
    return random(0, max);
}

function random_string() {
    var result = "";
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    for (let i = 0; i < random(5, 25); i++ )
        result += characters.charAt(rand(characters.length));
    return result;
}

function random_choice(values) {
    return values[rand(values.length)];
}

function string_similarity(s1, s2) {
    var longer = s1;
    var shorter = s2;
    if (s1.length < s2.length) {
      longer = s2;
      shorter = s1;
    }
    var longerLength = longer.length;
    if (longerLength == 0) {
      return 1.0;
    }
    return (longerLength - edit_distance(longer, shorter)) / longerLength;
  }

function edit_distance(s1, s2) {
    s1 = s1.toLowerCase();
    s2 = s2.toLowerCase();

    var costs = [];
    for (var i = 0; i <= s1.length; i++) {
        var lastValue = i;
        for (var j = 0; j <= s2.length; j++) {
            if (i == 0)
                costs.push(j);
            else if (j > 0) {
                var newValue = costs[j - 1];
                if (s1.charAt(i - 1) != s2.charAt(j - 1))
                    newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
                costs[j - 1] = lastValue;
                lastValue = newValue;
                }
        }
        if (i > 0)
            costs[s2.length] = lastValue;
    }
    return costs[s2.length];
}