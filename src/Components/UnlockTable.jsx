import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {fetchData, updateData} from '../DataSlice';
import {GenericDataTable} from './GenericDataTable';
import {StatusCell} from './StatusCell';
import {AmountAndPaymentTypeCell} from './AmountAndPaymentTypeCell';
import {CommentsCell} from './CommentsCell';
import {InputNumber} from 'primereact/inputnumber';
import {Dropdown} from 'primereact/dropdown';

const statuses = [
    {label: 'ÃÂÃÂÃÂºÃÂ»ÃÂ¾ÃÂ½ÃÂµÃÂ½', value: 'rejected', severity: 'danger'},
    {label: 'ÃÂÃÂ° ÃÂ¿ÃÂÃÂ¾ÃÂ²ÃÂµÃÂÃÂºÃÂµ', value: 'review', severity: 'warning'},
    {label: 'ÃÂÃÂ¾ÃÂ´ÃÂÃÂ²ÃÂµÃÂÃÂ¶ÃÂ´ÃÂµÃÂ½', value: 'approved', severity: 'info'},
    {label: 'ÃÂÃÂÃÂ¿ÃÂ»ÃÂ°ÃÂÃÂµÃÂ½ÃÂ¾', value: 'paid', severity: 'success'},
];

const paymentTypes = [
    {label: 'SWIFT', value: 'swift'},
    {label: 'ÃÂÃÂ°ÃÂÃÂÃÂ', value: 'cards'},
    {label: 'ÃÂÃÂÃÂ¸ÃÂ¿ÃÂÃÂ¾ÃÂ²ÃÂ°ÃÂ»ÃÂÃÂÃÂ°', value: 'cryptocurrency'},
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
        {field: 'time', header: 'ÃÂÃÂ°ÃÂÃÂ°/ÃÂ²ÃÂÃÂµÃÂ¼ÃÂ', sortable: true, style: {width: '13rem'}},
        {
            field: 'amount',
            header: 'ÃÂ¡ÃÂÃÂ¼ÃÂ¼ÃÂ°',
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
            header: 'ÃÂ¡ÃÂÃÂ°ÃÂÃÂÃÂ',
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
        />
    );
};

export default UnlockTable;