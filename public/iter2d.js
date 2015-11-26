"use strict";

define({
    
    map2dArray: function(array2d, func) {
	var result = [];

	for (var row = 0; row < array2d.length; row++) {
            result.push([]);
            var cols = array2d[row];
            for (var col = 0; col < cols.length; col++) {
		result[row][col] = func(cols[col], row, col);
            };
	};

	return result;
    },

    forEach2dArray : function(array2d, func) {
	for (var row = 0; row < array2d.length; row++) {
            var cols = array2d[row];
            for (var col = 0; col < cols.length; col++) {
		func(cols[col], row, col);
            };
	};
    }
});
