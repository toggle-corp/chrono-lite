import React, { useState, useMemo } from 'react';
import {
    _cs,
} from '@togglecorp/fujs';
import {
    Table,
    Pager,
    createStringColumn,
    createDateColumn,
    PendingMessage,
    MultiSelectInput,
} from '@togglecorp/toggle-ui';

import { useRequest } from '#utils/request';
import { MultiResponse } from '#utils/common';

import styles from './styles.css';

interface TimeSlot {
    id: number;
    date: string;
    endTime: string;
    project: number;
    projectDisplayName: string;
    remarks?: string;
    startTime: string;
    taskDisplayName: string;
    totalTime: string;
    totalTimeInSeconds: string;
    user: number;
    userDisplayName: string;
    userGroup: number;
    userGroupDisplayName: number;
}

interface User {
    id: number;
    name: string;
    displayName: string;
}

interface Props {
    className?: string;
}

const keySelector = (d: TimeSlot) => d.id;
const userKeySelector = (d: User) => d.id;
const userLabelSelector = (d: User) => d.displayName;

function Home(props: Props) {
    const { className } = props;

    const [activePage, setActivePage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [users, setUsers] = useState<number[] | undefined>([]);

    const {
        response: userResponse,
    } = useRequest<MultiResponse<User>>({
        url: '/users/',
        preserveResponse: true,
    });

    console.warn('users', userResponse);

    const requestQuery = useMemo(() => ({
        offset: (activePage - 1) * pageSize,
        limit: pageSize,
        user: users,
    }), [activePage, pageSize, users]);

    const {
        pending,
        response,
    } = useRequest<MultiResponse<TimeSlot>>({
        url: '/time-slots-stats/',
        query: requestQuery,
        preserveResponse: true,
    });

    const columns = useMemo(() => ([
        createStringColumn<TimeSlot, number>(
            'user',
            'User',
            (item) => item.userDisplayName,
            { sortable: true },
        ),
        createDateColumn<TimeSlot, number>(
            'date',
            'Date',
            (item) => item.date,
            { sortable: true },
        ),
        createStringColumn<TimeSlot, number>(
            'projectName',
            'Project Name',
            (item) => item.projectDisplayName,
            { sortable: true },
        ),
        createStringColumn<TimeSlot, number>(
            'taskDisplayName',
            'Task Name',
            (item) => item.taskDisplayName,
            { sortable: true },
        ),
        createStringColumn<TimeSlot, number>(
            'totalTime',
            'Total time',
            (item) => item.totalTime,
            { sortable: true },
        ),
    ]), []);

    console.warn('i am here', response);

    return (
        <div className={_cs(className, styles.home)}>
            <div className={styles.filter}>
                <MultiSelectInput
                    name="users"
                    value={users}
                    onChange={setUsers}
                    keySelector={userKeySelector}
                    labelSelector={userLabelSelector}
                    options={userResponse?.results}
                />
            </div>
            <div className={styles.content}>
                {pending && <PendingMessage />}
                <div className={styles.tableContainer}>
                    <Table
                        className={styles.table}
                        data={response?.results}
                        keySelector={keySelector}
                        columns={columns}
                    />
                </div>
                <div className={styles.footer}>
                    <Pager
                        className={styles.pager}
                        activePage={activePage}
                        itemsCount={response?.count ?? 0}
                        maxItemsPerPage={pageSize}
                        onActivePageChange={setActivePage}
                        onItemsPerPageChange={setPageSize}
                    />
                </div>
            </div>
        </div>
    );
}

export default Home;
