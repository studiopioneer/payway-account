import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {fetchData, deleteData, updateData} from '../DataSlice';
import {GenericDataTable} from './GenericDataTable';

export const WithdrawalTable = () => {
    const dispatch = useDispatch();
    const {data, totalRecords, loading} = useSelector((state) => state.data);

    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [sortField, setSortField] = useState('date_end');
    const [sortOrder, setSortOrder] = useState(-1);

    const endpoint = '/wp-json/payway/v1/stats';

    useEffect(() => {
        dispatch(fetchData({endpoint, page, perPage, sortField, sortOrder}));
    }, [dispatch, page, perPage, sortField, sortOrder]);

    const handlePage = (event) => {
        setPage(event.page + 1);
        setPerPage(event.rows);
    };

    const handleSort = (event) => {
        setSortField(event.sortField);
        setSortOrder(event.sortOrder);
    };

    const handleDelete = (id) => {
        dispatch(deleteData({endpoint, id}));
    };

    const onRowEditComplete = (e) => {
        const {newData} = e;
        dispatch(updateData({endpoint, id: newData.id, updatedData: newData}));
    };

    const formatDate = (date) => {
        if (!date) return date;

        return new Intl.DateTimeFormat('ru-RU', {
            day: 'numeric',
            month: 'numeric',
            year: 'numeric',
        }).format(new Date(date));
    };


    const columns = [
        {
            field: 'period',
            header: 'ÐÐµÑÐ¸Ð¾Ð´',
            sortable: true,
            style: {minWidth: '15rem'},
            body: (rowData) =>
                `${formatDate(rowData.date_start)} - ${formatDate(rowData.date_end)}`,

        },

        {field: 'project_url', header: 'ÐÑÐ¾ÐµÐºÑ', sortable: false, style: {minWidth: '20rem'}},
        {field: 'estimated_earnings_usd', header: 'ÐÐ°ÑÐ°Ð±Ð¾ÑÐ°Ð½Ð¾ ($)', sortable: true, style: {minWidth: '11rem'}},
        {field: 'page_views', header: 'ÐÑÐ¾ÑÐ¼Ð¾ÑÑÑ ÑÑÑÐ°Ð½Ð¸Ñ', sortable: true, style: {minWidth: '13rem'}},
        {field: 'page_rpm_usd', header: 'RPM ÑÑÑÐ°Ð½Ð¸ÑÑ ($)', sortable: true, style: {minWidth: '13rem'}},
        {field: 'impressions', header: 'ÐÐ¾ÐºÐ°Ð·Ñ', sortable: true, style: {minWidth: '10rem'}},
        {field: 'impression_rpm_usd', header: 'RPM Ð¿Ð¾ÐºÐ°Ð·Ð¾Ð² ($)', sortable: true, style: {minWidth: '13rem'}},
        {field: 'active_view_viewable', header: 'ÐÐºÑÐ¸Ð²Ð½ÑÐµ Ð¿ÑÐ¾ÑÐ¼Ð¾ÑÑÑ (%)', sortable: true, style: {minWidth: '15rem'}},
        {field: 'clicks', header: 'ÐÐ»Ð¸ÐºÐ¸', sortable: true, style: {minWidth: '6rem'}},
    ];

    return (
        <GenericDataTable
            columns={columns}
            data={data}
            totalRecords={totalRecords}
            loading={loading}
            onPage={handlePage}
            onSort={handleSort}
            //onRowEditComplete={onRowEditComplete}
            //onDelete={handleDelete}
        />
    );
};

export default WithdrawalTable;