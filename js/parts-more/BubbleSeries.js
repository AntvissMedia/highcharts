/**
 * (c) 2010-2017 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */
'use strict';
import H from '../parts/Globals.js';
import '../parts/Utilities.js';
import '../parts/Axis.js';
import '../parts/Color.js';
import '../parts/Point.js';
import '../parts/Series.js';
import '../parts/ScatterSeries.js';
var arrayMax = H.arrayMax,
	arrayMin = H.arrayMin,
	Axis = H.Axis,
	color = H.color,
	each = H.each,
	isNumber = H.isNumber,
	noop = H.noop,
	pick = H.pick,
	pInt = H.pInt,
	Point = H.Point,
	Series = H.Series,
	seriesType = H.seriesType,
	seriesTypes = H.seriesTypes;


/**
 * A bubble series is a three dimensional series type where each point renders
 * an X, Y and Z value. Each points is drawn as a bubble where the position
 * along the X and Y axes mark the X and Y values, and the size of the bubble
 * relates to the Z value. Requires `highcharts-more.js`.
 *
 * @sample       {highcharts} highcharts/demo/bubble/ Bubble chart
 * @extends      plotOptions.scatter
 * @product      highcharts highstock
 * @optionparent plotOptions.bubble
 */
seriesType('bubble', 'scatter', {

	dataLabels: {
		formatter: function () { // #2945
			return this.point.z;
		},
		inside: true,
		verticalAlign: 'middle'
	},
	
	/**
	 * Whether to display negative sized bubbles. The threshold is given
	 * by the [zThreshold](#plotOptions.bubble.zThreshold) option, and negative
	 * bubbles can be visualized by setting
	 * [negativeColor](#plotOptions.bubble.negativeColor).
	 * 
	 * @type      {Boolean}
	 * @sample    {highcharts} highcharts/plotoptions/bubble-negative/
	 *            Negative bubbles
	 * @default   true
	 * @since     3.0
	 * @product   highcharts
	 * @apioption plotOptions.bubble.displayNegative
	 */

	/**
	 * Options for the point markers of line-like series. Properties like
	 * `fillColor`, `lineColor` and `lineWidth` define the visual appearance
	 * of the markers. Other series types, like column series, don't have
	 * markers, but have visual options on the series level instead.
	 * 
	 * In styled mode, the markers can be styled with the `.highcharts-point`,
	 * `.highcharts-point-hover` and `.highcharts-point-select`
	 * class names.
	 * 
	 * @type      {Object}
	 * @extends   plotOptions.series.marker
	 * @excluding enabled,height,radius,width
	 * @product   highcharts
	 */
	marker: {
		/*= if (build.classic) { =*/
		lineColor: null, // inherit from series.color
		lineWidth: 1,

		/**
		 * The fill opacity of the bubble markers.
		 *
		 * @type      {Number}
		 * @default   0.5
		 * @product   highcharts
    	 * @apioption plotOptions.bubble.fillOpacity
		 */

		/*= } =*/
		/**
		 * In bubble charts, the radius is overridden and determined based on 
		 * the point's data value.
		 */
		/** @ignore */
		radius: null,

		states: {
			hover: {
				radiusPlus: 0
			}
		},

		/**
		 * A predefined shape or symbol for the marker. Possible values are
		 * "circle", "square", "diamond", "triangle" and "triangle-down".
		 * 
		 * Additionally, the URL to a graphic can be given on the form
		 * `url(graphic.png)`. Note that for the image to be applied to exported
		 * charts, its URL needs to be accessible by the export server.
		 * 
		 * Custom callbacks for symbol path generation can also be added to
		 * `Highcharts.SVGRenderer.prototype.symbols`. The callback is then
		 * used by its method name, as shown in the demo.
		 * 
		 * @validvalue ["circle", "square", "diamond", "triangle",
		 *              "triangle-down"]
		 * @type       {String}
		 * @sample     {highcharts} highcharts/plotoptions/bubble-symbol/
		 *             Bubble chart with various symbols
		 * @sample     {highcharts} highcharts/plotoptions/series-marker-symbol/
		 *             General chart with predefined, graphic and custom markers
		 * @default    circle
		 * @since      5.0.11
		 * @product    highcharts
		 */
		symbol: 'circle'
	},

	/**
	 * Minimum bubble size. Bubbles will automatically size between the
	 * `minSize` and `maxSize` to reflect the `z` value of each bubble.
	 * Can be either pixels (when no unit is given), or a percentage of
	 * the smallest one of the plot width and height.
	 * 
	 * @type    {Number|String}
	 * @sample  {highcharts} highcharts/plotoptions/bubble-size/ Bubble size
	 * @since   3.0
	 * @product highcharts
	 */
	minSize: 8,

	/**
	 * Maximum bubble size. Bubbles will automatically size between the
	 * `minSize` and `maxSize` to reflect the `z` value of each bubble.
	 * Can be either pixels (when no unit is given), or a percentage of
	 * the smallest one of the plot width and height.
	 * 
	 * @sample  {highcharts} highcharts/plotoptions/bubble-size/
	 *          Bubble size
	 * @since   3.0
	 * @product highcharts
	 */
	maxSize: '20%',
	
	/**
	 * When a point's Z value is below the
	 * [zThreshold](#plotOptions.bubble.zThreshold) setting, this color is used.
	 * 
	 * @type      {Color}
	 * @sample    {highcharts} highcharts/plotoptions/bubble-negative/
	 *            Negative bubbles
	 * @default   null
	 * @since     3.0
	 * @product   highcharts
	 * @apioption plotOptions.bubble.negativeColor
	 */
	
	/**
	 * Whether the bubble's value should be represented by the area or the
	 * width of the bubble. The default, `area`, corresponds best to the
	 * human perception of the size of each bubble.
	 * 
	 * @validvalue ["area", "width"]
	 * @type       {String}
	 * @sample     {highcharts} highcharts/plotoptions/bubble-sizeby/
	 *             Comparison of area and size
	 * @default    area
	 * @since      3.0.7
	 * @product    highcharts
	 * @apioption  plotOptions.bubble.sizeBy
	 */
	
	/**
	 * When this is true, the absolute value of z determines the size of
	 * the bubble. This means that with the default `zThreshold` of 0, a
	 * bubble of value -1 will have the same size as a bubble of value 1,
	 * while a bubble of value 0 will have a smaller size according to
	 * `minSize`.
	 * 
	 * @type      {Boolean}
	 * @sample    {highcharts}
	 *            highcharts/plotoptions/bubble-sizebyabsolutevalue/
	 *            Size by absolute value, various thresholds
	 * @default   false
	 * @since     4.1.9
	 * @product   highcharts
	 * @apioption plotOptions.bubble.sizeByAbsoluteValue
	 */

	/**
	 * When this is true, the series will not cause the Y axis to cross
	 * the zero plane (or [threshold](#plotOptions.series.threshold) option)
	 * unless the data actually crosses the plane.
	 * 
	 * For example, if `softThreshold` is `false`, a series of 0, 1, 2,
	 * 3 will make the Y axis show negative values according to the `minPadding`
	 * option. If `softThreshold` is `true`, the Y axis starts at 0.
	 * 
	 * @since   4.1.9
	 * @product highcharts
	 */
	softThreshold: false,

	states: {
		hover: {
			halo: {
				size: 5
			}
		}
	},

	tooltip: {
		pointFormat: '({point.x}, {point.y}), Size: {point.z}'
	},

	turboThreshold: 0,

	/**
	 * When [displayNegative](#plotOptions.bubble.displayNegative) is `false`,
	 * bubbles with lower Z values are skipped. When `displayNegative`
	 * is `true` and a [negativeColor](#plotOptions.bubble.negativeColor)
	 * is given, points with lower Z is colored.
	 * 
	 * @type    {Number}
	 * @sample  {highcharts} highcharts/plotoptions/bubble-negative/
	 *          Negative bubbles
	 * @default 0
	 * @since   3.0
	 * @product highcharts
	 */
	zThreshold: 0,

	zoneAxis: 'z'

	/**
	 * The minimum for the Z value range. Defaults to the highest Z value
	 * in the data.
	 * 
	 * @type      {Number}
	 * @see       [zMin](#plotOptions.bubble.zMin)
	 * @sample    {highcharts} highcharts/plotoptions/bubble-zmin-zmax/
	 *            Z has a possible range of 0-100
	 * @default   null
	 * @since     4.0.3
	 * @product   highcharts
	 * @apioption plotOptions.bubble.zMax
	 */

	/**
	 * The minimum for the Z value range. Defaults to the lowest Z value
	 * in the data.
	 * 
	 * @type      {Number}
	 * @see       [zMax](#plotOptions.bubble.zMax)
	 * @sample    {highcharts} highcharts/plotoptions/bubble-zmin-zmax/
	 *            Z has a possible range of 0-100
	 * @default   null
	 * @since     4.0.3
	 * @product   highcharts
	 * @apioption plotOptions.bubble.zMin
	 */

// Prototype members
}, {
	pointArrayMap: ['y', 'z'],
	parallelArrays: ['x', 'y', 'z'],
	trackerGroups: ['group', 'dataLabelsGroup'],
	specialGroup: 'group', // To allow clipping (#6296)
	bubblePadding: true,
	zoneAxis: 'z',
	directTouch: true,

	/*= if (build.classic) { =*/
	pointAttribs: function (point, state) {
		var markerOptions = this.options.marker,
			fillOpacity = pick(markerOptions.fillOpacity, 0.5),
			attr = Series.prototype.pointAttribs.call(this, point, state);

		if (fillOpacity !== 1) {
			attr.fill = color(attr.fill).setOpacity(fillOpacity).get('rgba');
		}

		return attr;
	},
	/*= } =*/

	/**
	 * Get the radius for each point based on the minSize, maxSize and each
	 * point's Z value. This must be done prior to Series.translate because
	 * the axis needs to add padding in accordance with the point sizes.
	 */
	getRadii: function (zMin, zMax, minSize, maxSize) {
		var len,
			i,
			pos,
			zData = this.zData,
			radii = [],
			options = this.options,
			sizeByArea = options.sizeBy !== 'width',
			zThreshold = options.zThreshold,
			zRange = zMax - zMin,
			value,
			radius;

		// Set the shape type and arguments to be picked up in drawPoints
		for (i = 0, len = zData.length; i < len; i++) {

			value = zData[i];

			// When sizing by threshold, the absolute value of z determines
			// the size of the bubble.
			if (options.sizeByAbsoluteValue && value !== null) {
				value = Math.abs(value - zThreshold);
				zMax = Math.max(zMax - zThreshold, Math.abs(zMin - zThreshold));
				zMin = 0;
			}

			if (value === null) {
				radius = null;
			// Issue #4419 - if value is less than zMin, push a radius that's
			// always smaller than the minimum size
			} else if (value < zMin) {
				radius = minSize / 2 - 1;
			} else {
				// Relative size, a number between 0 and 1
				pos = zRange > 0 ? (value - zMin) / zRange : 0.5;

				if (sizeByArea && pos >= 0) {
					pos = Math.sqrt(pos);
				}
				radius = Math.ceil(minSize + pos * (maxSize - minSize)) / 2;
			}
			radii.push(radius);
		}
		this.radii = radii;
	},

	/**
	 * Perform animation on the bubbles
	 */
	animate: function (init) {
		var animation = this.options.animation;

		if (!init) { // run the animation
			each(this.points, function (point) {
				var graphic = point.graphic,
					animationTarget;

				if (graphic && graphic.width) { // URL symbols don't have width
					animationTarget = {
						x: graphic.x,
						y: graphic.y,
						width: graphic.width,
						height: graphic.height
					};

					// Start values
					graphic.attr({
						x: point.plotX,
						y: point.plotY,
						width: 1,
						height: 1
					});

					// Run animation
					graphic.animate(animationTarget, animation);
				}
			});

			// delete this function to allow it only once
			this.animate = null;
		}
	},

	/**
	 * Extend the base translate method to handle bubble size
	 */
	translate: function () {

		var i,
			data = this.data,
			point,
			radius,
			radii = this.radii;

		// Run the parent method
		seriesTypes.scatter.prototype.translate.call(this);

		// Set the shape type and arguments to be picked up in drawPoints
		i = data.length;

		while (i--) {
			point = data[i];
			radius = radii ? radii[i] : 0; // #1737

			if (isNumber(radius) && radius >= this.minPxSize / 2) {
				// Shape arguments
				point.marker = H.extend(point.marker, {
					radius: radius,
					width: 2 * radius,
					height: 2 * radius
				});

				// Alignment box for the data label
				point.dlBox = {
					x: point.plotX - radius,
					y: point.plotY - radius,
					width: 2 * radius,
					height: 2 * radius
				};
			} else { // below zThreshold
				// #1691
				point.shapeArgs = point.plotY = point.dlBox = undefined;
			}
		}
	},

	alignDataLabel: seriesTypes.column.prototype.alignDataLabel,
	buildKDTree: noop,
	applyZones: noop

// Point class
}, {
	haloPath: function (size) {
		return Point.prototype.haloPath.call(
			this,
			// #6067
			size === 0 ? 0 : (this.marker ? this.marker.radius || 0 : 0) + size
		);
	},
	ttBelow: false
});

/**
 * Add logic to pad each axis with the amount of pixels
 * necessary to avoid the bubbles to overflow.
 */
Axis.prototype.beforePadding = function () {
	var axis = this,
		axisLength = this.len,
		chart = this.chart,
		pxMin = 0,
		pxMax = axisLength,
		isXAxis = this.isXAxis,
		dataKey = isXAxis ? 'xData' : 'yData',
		min = this.min,
		extremes = {},
		smallestSize = Math.min(chart.plotWidth, chart.plotHeight),
		zMin = Number.MAX_VALUE,
		zMax = -Number.MAX_VALUE,
		range = this.max - min,
		transA = axisLength / range,
		activeSeries = [];

	// Handle padding on the second pass, or on redraw
	each(this.series, function (series) {

		var seriesOptions = series.options,
			zData;

		if (
			series.bubblePadding &&
			(series.visible || !chart.options.chart.ignoreHiddenSeries)
		) {

			// Correction for #1673
			axis.allowZoomOutside = true;

			// Cache it
			activeSeries.push(series);

			if (isXAxis) { // because X axis is evaluated first

				// For each series, translate the size extremes to pixel values
				each(['minSize', 'maxSize'], function (prop) {
					var length = seriesOptions[prop],
						isPercent = /%$/.test(length);

					length = pInt(length);
					extremes[prop] = isPercent ?
						smallestSize * length / 100 :
						length;

				});
				series.minPxSize = extremes.minSize;
				// Prioritize min size if conflict to make sure bubbles are
				// always visible. #5873
				series.maxPxSize = Math.max(extremes.maxSize, extremes.minSize);

				// Find the min and max Z
				zData = series.zData;
				if (zData.length) { // #1735
					zMin = pick(seriesOptions.zMin, Math.min(
						zMin,
						Math.max(
							arrayMin(zData), 
							seriesOptions.displayNegative === false ?
								seriesOptions.zThreshold :
								-Number.MAX_VALUE
						)
					));
					zMax = pick(
						seriesOptions.zMax,
						Math.max(zMax, arrayMax(zData))
					);
				}
			}
		}
	});

	each(activeSeries, function (series) {

		var data = series[dataKey],
			i = data.length,
			radius;

		if (isXAxis) {
			series.getRadii(zMin, zMax, series.minPxSize, series.maxPxSize);
		}

		if (range > 0) {
			while (i--) {
				if (
					isNumber(data[i]) &&
					axis.dataMin <= data[i] &&
					data[i] <= axis.dataMax
				) {
					radius = series.radii[i];
					pxMin = Math.min(
						((data[i] - min) * transA) - radius,
						pxMin
					);
					pxMax = Math.max(
						((data[i] - min) * transA) + radius,
						pxMax
					);
				}
			}
		}
	});

	if (activeSeries.length && range > 0 && !this.isLog) {
		pxMax -= axisLength;
		transA *= (axisLength + pxMin - pxMax) / axisLength;
		each(
			[['min', 'userMin', pxMin], ['max', 'userMax', pxMax]],
			function (keys) {
				if (pick(axis.options[keys[0]], axis[keys[1]]) === undefined) {
					axis[keys[0]] += keys[2] / transA; 
				}
			}
		);
	}
};


/**
 * A `bubble` series. If the [type](#series.bubble.type) option is
 * not specified, it is inherited from [chart.type](#chart.type).
 * 
 * For options that apply to multiple series, it is recommended to add
 * them to the [plotOptions.series](#plotOptions.series) options structure.
 * To apply to all series of this specific type, apply it to [plotOptions.
 * bubble](#plotOptions.bubble).
 * 
 * @type      {Object}
 * @extends   series,plotOptions.bubble
 * @excluding dataParser,dataURL,stack
 * @product   highcharts
 * @apioption series.bubble
 */

/**
 * An array of data points for the series. For the `bubble` series type,
 * points can be given in the following ways:
 * 
 * 1.  An array of arrays with 3 or 2 values. In this case, the values
 * correspond to `x,y,z`. If the first value is a string, it is applied
 * as the name of the point, and the `x` value is inferred. The `x`
 * value can also be omitted, in which case the inner arrays should
 * be of length 2\. Then the `x` value is automatically calculated,
 * either starting at 0 and incremented by 1, or from `pointStart` and
 * `pointInterval` given in the series options.
 * 
 *  ```js
 *     data: [
 *         [0, 1, 2],
 *         [1, 5, 5],
 *         [2, 0, 2]
 *     ]
 *  ```
 * 
 * 2.  An array of objects with named values. The objects are point
 * configuration objects as seen below. If the total number of data
 * points exceeds the series' [turboThreshold](#series.bubble.turboThreshold),
 * this option is not available.
 * 
 *  ```js
 *     data: [{
 *         x: 1,
 *         y: 1,
 *         z: 1,
 *         name: "Point2",
 *         color: "#00FF00"
 *     }, {
 *         x: 1,
 *         y: 5,
 *         z: 4,
 *         name: "Point1",
 *         color: "#FF00FF"
 *     }]
 *  ```
 * 
 * @type      {Array<Object|Array>}
 * @extends   series.line.data
 * @excluding marker
 * @sample    {highcharts} highcharts/chart/reflow-true/
 *            Numerical values
 * @sample    {highcharts} highcharts/series/data-array-of-arrays/
 *            Arrays of numeric x and y
 * @sample    {highcharts} highcharts/series/data-array-of-arrays-datetime/
 *            Arrays of datetime x and y
 * @sample    {highcharts} highcharts/series/data-array-of-name-value/
 *            Arrays of point.name and y
 * @sample    {highcharts} highcharts/series/data-array-of-objects/
 *            Config objects
 * @product   highcharts
 * @apioption series.bubble.data
 */

/**
 * The size value for each bubble. The bubbles' diameters are computed
 * based on the `z`, and controlled by series options like `minSize`,
 * `maxSize`, `sizeBy`, `zMin` and `zMax`.
 * 
 * @type {Number}
 * @product highcharts
 * @apioption series.bubble.data.z
 */
