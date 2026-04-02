import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {fetchData, deleteData, updateData} from '../DataSlice';
import {GenericDataTable} from './GenericDataTable';
import {StatusCell} from './StatusCell';
import {AmountAndPaymentTypeCell} from './AmountAndPaymentTypeCell';
import {CommentsCell} from './CommentsCell';
import {InputNumber} from 'primereact/inputnumber';
import {Dropdown} from 'primereact/dropdown';

const statuses = [
    {label: 'ÐÑÐºÐ»Ð¾Ð½ÐµÐ½', value: 'rejected', severity: 'danger'},
    {label: 'ÐÐ° Ð¿ÑÐ¾Ð²ÐµÑÐºÐµ', value: 'review', severity: 'warning'},
    {label: 'ÐÐ¾Ð´ÑÐ²ÐµÑÐ¶Ð´ÐµÐ½', value: 'approved', severity: 'info'},
    {label: 'ÐÑÐ¿Ð»Ð°ÑÐµÐ½Ð¾', value: 'paid', severity: 'success'},
];

const paymentTypes = [
    {label: 'SWIFT', value: 'swift'},
    {label: 'ÐÐ°ÑÑÑ', value: 'cards'},
    {label: 'ÐÑÐ¸Ð¿ÑÐ¾Ð²Ð°Ð»ÑÑÐ°', value: 'cryptocurrency'},
];

const icons = {
    swift: 'pi pi-globe',
    cards: 'pi pi-credit-card',
    cryptocurrency: 'pi pi-bitcoin',
};

export const UnlockTable = () => {
    const dispatch = useDispatch();
    const {data, totalRecords, loading} = useSelector((state) => state.data);

    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [sortField, setSortField] = useState('time');
    const [sortOrder, setSortOrder] = useState(-1);

    const endpoint = '/wp-json/payway/v1/unlock';

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

    const columns = [
        {field: 'time', header: 'ÐÐ°ÑÐ°/Ð²ÑÐµÐ¼Ñ', sortable: true, style: {width: '13rem'}},
        {
            field: 'amount',
            header: 'Ð¡ÑÐ¼Ð¼Ð°',
            body: (rowData) => {
                return (
                    <div className="flex align-items-center gap-2">
                        <span>${rowData.amount}</span>
                    </div>
                );
            },
            sortable: true,
        },
        {
            field: 'status',
            header: 'Ð¡ÑÐ°ÑÑÑ',
            body: (rowData) => <StatusCell rowData={rowData} statuses={statuses}/>,
            sortable: true,
            style: {width: '8rem'}
        },
    ];

    return (
        <GenericDataTable
            columns={columns}
            data={data}
            totalRecords={totalRecords}
            loading={loading}
            onPage={handlePage}
            onSort={handleSort}
            onRowEditComplete={onRowEditComplete}
            onDelete={handleDelete}
        />
    );
};

export default UnlockTable;