import React from 'react';
import { _cs } from '@togglecorp/fujs';

import { useRequest } from '#utils/request';
import { MultiResponse } from '#utils/common';

import styles from './styles.css';

interface TimeSlot {
}

interface Props {
    className?: string;
}

function Home(props: Props) {
    const { className } = props;

    const {
        response,
    } = useRequest<MultiResponse<TimeSlot>>({
        url: '/time-slots-stats/project-wise/',
        preserveResponse: true,
    });

    console.warn('i am here', response);

    return (
        <div className={_cs(className, styles.home)}>
            Chrono Lite
        </div>
    );
}

export default Home;
