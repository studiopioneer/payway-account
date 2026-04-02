import React, {useEffect, useState, useRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {fetchData, deleteData, updateData} from '../DataSlice';
import {GenericDataTable} from './GenericDataTable';
import {StatusCell} from './StatusCell';
import ServiceTitle from "./ServiceTitle.jsx";
import {Toast} from 'primereact/toast'; // ÐÐ¼Ð¿Ð¾ÑÑÐ¸ÑÑÐµÐ¼ Toast

const statuses = [
    {label: 'ÐÑÐºÐ»Ð¾Ð½ÐµÐ½', value: 'rejected', severity: 'danger'},
    {label: 'ÐÐ° Ð¿ÑÐ¾Ð²ÐµÑÐºÐµ', value: 'review', severity: 'warning'},
    {label: 'ÐÐ¾Ð´ÑÐ²ÐµÑÐ¶Ð´ÐµÐ½', value: 'approved', severity: 'info'},
    {label: 'ÐÑÐ¿Ð»Ð°ÑÐµÐ½Ð¾', value: 'paid', severity: 'success'},
];

export const ProjectsTable = () => {
    const dispatch = useDispatch();
    const {data, totalRecords, loading} = useSelector((state) => state.data);
    const toast = useRef(null); // Ð¡Ð¾Ð·Ð´Ð°ÐµÐ¼ ÑÑÑÐ»ÐºÑ Ð½Ð° Toast

    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(2);
    const [sortField, setSortField] = useState('time');
    const [sortOrder, setSortOrder] = useState(-1);

    const endpoint = '/wp-json/payway/v1/projects';

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

    const handleDelete = async (id) => {
        try {
            // ÐÑÐ¿Ð¾Ð»Ð½ÑÐµÐ¼ ÑÐ´Ð°Ð»ÐµÐ½Ð¸Ðµ
            await dispatch(deleteData({endpoint, id})).unwrap();

            // ÐÐ¾ÐºÐ°Ð·ÑÐ²Ð°ÐµÐ¼ ÑÐ¾Ð¾Ð±ÑÐµÐ½Ð¸Ðµ Ð¾Ð± ÑÑÐ¿ÐµÑÐ½Ð¾Ð¼ ÑÐ´Ð°Ð»ÐµÐ½Ð¸Ð¸
            toast.current.show({
                severity: 'success',
                summary: 'Ð£ÑÐ¿ÐµÑÐ½Ð¾',
                detail: 'ÐÑÐ¾ÐµÐºÑ ÑÑÐ¿ÐµÑÐ½Ð¾ ÑÐ´Ð°Ð»ÐµÐ½',
                life: 3000,
            });
        } catch (error) {
            // ÐÐ¾ÐºÐ°Ð·ÑÐ²Ð°ÐµÐ¼ ÑÐ¾Ð¾Ð±ÑÐµÐ½Ð¸Ðµ Ð¾Ð± Ð¾ÑÐ¸Ð±ÐºÐµ
            toast.current.show({
                severity: 'error',
                summary: 'ÐÑÐ¸Ð±ÐºÐ°',
                detail: 'ÐÐµ ÑÐ´Ð°Ð»Ð¾ÑÑ ÑÐ´Ð°Ð»Ð¸ÑÑ Ð¿ÑÐ¾ÐµÐºÑ',
                life: 3000,
            });
        }
    };

    const onRowEditComplete = (e) => {
        const {newData} = e;
        dispatch(updateData({endpoint, id: newData.id, updatedData: newData}));
    };

    const columns = [
        {
            field: 'url',
            header: 'ÐÐµÑÐ°Ð»Ð¸ Ð¿ÑÐ¾ÐµÐºÑÐ°',
            body: (rowData) => (
                <div>
                    <div className="grid">
                        {/* Ð¡ÑÑÐ¾ÐºÐ° Ñ URL */}
                        <div className="col-12 mb-3 text-sm flex align-items-center">
                            <ServiceTitle url={rowData.url}/>
                        </div>

                        {/* ÐÐ¾Ð¼Ð¼ÐµÐ½ÑÐ°ÑÐ¸Ð¹ */}
                        <div className="col-12 text-xs border-1 border-200 border-round-xs mb-3 surface-50 p-2">
                            <div className="flex align-items-center">
                                <i className="pi pi-comment mr-2"></i>
                                <strong className="font-semibold">ÐÐ¾Ð¼Ð¼ÐµÐ½ÑÐ°ÑÐ¸Ð¹: </strong>
                            </div>
                            <p className="text-400 font-italic pl-4">{rowData.comments || 'ÐÐµÑ Ð´Ð°Ð½Ð½ÑÑ'}</p>
                        </div>

                        {/* ÐÐ±Ð¾ÑÐ¾Ñ Ð² Ð¼ÐµÑÑÑ Ð¸ ÐºÐ¾Ð»Ð¸ÑÐµÑÑÐ²Ð¾ Ð¿Ð¾Ð»ÑÐ·Ð¾Ð²Ð°ÑÐµÐ»ÐµÐ¹ */}
                        <div className="col-12 md:col-6 p-0 text-xs">
                            <div className="col-12 flex align-items-center">
                                <i className="pi pi-chart-line mr-2"></i>
                                <strong className="font-semibold">ÐÐ±Ð¾ÑÐ¾Ñ Ð² Ð¼ÐµÑÑÑ: </strong>
                                <span className="inline-block ml-1">${rowData.amount || 'ÐÐµÑ Ð´Ð°Ð½Ð½ÑÑ'}</span>
                            </div>
                            <div className="col-12 flex align-items-center">
                                <i className="pi pi-users mr-2"></i>
                                <strong className="font-semibold">ÐÐ¾Ð»Ð¸ÑÐµÑÑÐ²Ð¾ Ð¿Ð¾Ð»ÑÐ·Ð¾Ð²Ð°ÑÐµÐ»ÐµÐ¹:</strong>
                                <span className="inline-block ml-1">{rowData.count_users || 'ÐÐµÑ Ð´Ð°Ð½Ð½ÑÑ'}</span>
                            </div>
                        </div>

                        {/* ÐÐ¾Ð½ÑÐ°ÐºÑÐ½ÑÐµ Ð´Ð°Ð½Ð½ÑÐµ */}
                        <div className="col-12 md:col-6 text-xs">
                            <div className="col-12 flex align-items-center">
                                <i className="pi pi-telegram mr-2"></i>
                                <strong className="font-semibold">ÐÐ¾Ð½ÑÐ°ÐºÑÐ½ÑÐµ Ð´Ð°Ð½Ð½ÑÐµ: </strong>
                                <span className="inline-block ml-1">{rowData.contacts || 'ÐÐµÑ Ð´Ð°Ð½Ð½ÑÑ'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            ),
            sortable: false,
        },
        {
            field: 'time',
            header: 'ÐÐ°ÑÐ°',
            sortable: true,
            className: 'align-top text-sm',
            style: {width: '13rem', verticalAlign: 'top'},
        },
        {
            field: 'status',
            header: 'Ð¡ÑÐ°ÑÑÑ',
            body: (rowData) => <StatusCell rowData={rowData} statuses={statuses}/>,
            sortable: true,
            className: 'align-top text-sm',
            style: {width: '8rem', verticalAlign: 'top'},
        },
    ];

    return (
        <div>
            <Toast ref={toast}/> {/* ÐÐ¾Ð±Ð°Ð²Ð»ÑÐµÐ¼ ÐºÐ¾Ð¼Ð¿Ð¾Ð½ÐµÐ½Ñ Toast */}
            <GenericDataTable
                columns={columns}
                data={data}
                totalRecords={totalRecords}
                loading={loading}
                onPage={handlePage}
                onSort={handleSort}
                onDelete={handleDelete}
                onRowEditComplete={onRowEditComplete}
                emptyMessage="ÐÑÐµ Ð½ÐµÑ Ð½Ð¸ Ð¾Ð´Ð½Ð¾Ð³Ð¾ Ð¿ÑÐ¾ÐµÐºÑÐ°"
                rowsPerPageOptions={[2, 3, 5]}
            />
        </div>
    );
};

export default ProjectsTable;