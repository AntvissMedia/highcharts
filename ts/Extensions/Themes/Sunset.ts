/* *
 *
 *  (c) 2010-2021 Highsoft AS
 *
 *  Author: Øystein Moseng
 *
 *  License: www.highcharts.com/license
 *
 *  Accessible high-contrast theme for Highcharts. Considers colorblindness and
 *  monochrome rendering.
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import type { SeriesTypePlotOptions } from '../../Core/Series/SeriesType';
import H from '../../Core/Globals.js';
import O from '../../Core/Options.js';
const { setOptions } = O;

H.theme = {
    colors: ['#FDD089', '#FF7F79', '#A0446E', '#251535'],

    colorAxis: {
        maxColor: '#60042E',
        minColor: '#FDD089'
    },

    plotOptions: {
        map: {
            nullColor: '#fefefc'
        }
    } as SeriesTypePlotOptions,

    navigator: {
        series: {
            color: '#FF7F79',
            lineColor: '#A0446E'
        }
    }
};

// Apply the theme
setOptions(H.theme);
