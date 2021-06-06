import React, { useMemo } from 'react';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';

import { RequestContext } from '#utils/request';
import {
    processUrls,
    processOptions,
    processResponse,
    processError,
    ChronoContextInterface,
} from '#utils/request/chrono';

import '@togglecorp/toggle-ui/build/index.css';
import '../../node_modules/mapbox-gl/dist/mapbox-gl.css';
import './styles.css';

import Multiplexer from './Multiplexer';

const history = createBrowserHistory();

function Root() {
    const requestContextValue = useMemo((): ChronoContextInterface => ({
        transformUrl: processUrls,
        transformOptions: processOptions,
        transformResponse: processResponse,
        transformError: processError,
    }), []);

    return (
        <Router history={history}>
            <RequestContext.Provider value={requestContextValue}>
                <Multiplexer />
            </RequestContext.Provider>
        </Router>
    );
}

export default Root;
