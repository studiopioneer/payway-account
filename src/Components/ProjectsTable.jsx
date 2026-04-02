import React, {useEffect, useState, useRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {fetchData, deleteData, updateData} from '../dataSlice';
import {GenericDataTable} from './GenericDataTable';
import {StatusCell} from './StatusCell';
import ServiceTitle from "./ServiceTitle.jsx";
import {Toast} from 'primereact/toast'; // Импортируем Toast

const statuses = [
    {label: 'Отклонен', value: 'rejected', severity: 'danger'},
    {label: 'На проверке', value: 'review', severity: 'warning'},
    {label: 'Подтвержден', value: 'approved', severity: 'info'},
    {label: 'Выплачено', value: 'paid', severity: 'success'},
];

export const ProjectsTable = () => {
    const dispatch = useDispatch();
    const {data, totalRecords, loading} = useSelector((state) => state.data);
    const toast = useRef(null); // Создаем ссылку на Toast

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
            // Выполняем удаление
            await dispatch(deleteData({endpoint, id})).unwrap();

            // Показываем сообщение об успешном удалении
            toast.current.show({
                severity: 'success',
                summary: 'Успешно',
                detail: 'Проект успешно удален',
                life: 3000,
            });
        } catch (error) {
            // Показываем сообщение об ошибке
            toast.current.show({
                severity: 'error',
                summary: 'Ошибка',
                detail: 'Не удалось удалить проект',
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
            header: 'Детали проекта',
            body: (rowData) => (
                <div>
                    <div className="grid">
                        {/* Строка с URL */}
                        <div className="col-12 mb-3 text-sm flex align-items-center">
                            <ServiceTitle url={rowData.url}/>
                        </div>

                        {/* Комментарий */}
                        <div className="col-12 text-xs border-1 border-200 border-round-xs mb-3 surface-50 p-2">
                            <div className="flex align-items-center">
                                <i className="pi pi-comment mr-2"></i>
                                <strong className="font-semibold">Комментарий: </strong>
                            </div>
                            <p className="text-400 font-italic pl-4">{rowData.comments || 'Нет данных'}</p>
                        </div>

                        {/* Оборот в месяц и количество пользователей */}
                        <div className="col-12 md:col-6 p-0 text-xs">
                            <div className="col-12 flex align-items-center">
                                <i className="pi pi-chart-line mr-2"></i>
                                <strong className="font-semibold">Оборот в месяц: </strong>
                                <span className="inline-block ml-1">${rowData.amount || 'Нет данных'}</span>
                            </div>
                            <div className="col-12 flex align-items-center">
                                <i className="pi pi-users mr-2"></i>
                                <strong className="font-semibold">Количество пользователей:</strong>
                                <span className="inline-block ml-1">{rowData.count_users || 'Нет данных'}</span>
                            </div>
                        </div>

                        {/* Контактные данные */}
                        <div className="col-12 md:col-6 text-xs">
                            <div className="col-12 flex align-items-center">
                                <i className="pi pi-telegram mr-2"></i>
                                <strong className="font-semibold">Контактные данные: </strong>
                                <span className="inline-block ml-1">{rowData.contacts || 'Нет данных'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            ),
            sortable: false,
        },
        {
            field: 'time',
            header: 'Дата',
            sortable: true,
            className: 'align-top text-sm',
            style: {width: '13rem', verticalAlign: 'top'},
        },
        {
            field: 'status',
            header: 'Статус',
            body: (rowData) => <StatusCell rowData={rowData} statuses={statuses}/>,
            sortable: true,
            className: 'align-top text-sm',
            style: {width: '8rem', verticalAlign: 'top'},
        },
    ];

    return (
        <div>
            <Toast ref={toast}/> {/* Добавляем компонент Toast */}
            <GenericDataTable
                columns={columns}
                data={data}
                totalRecords={totalRecords}
                loading={loading}
                onPage={handlePage}
                onSort={handleSort}
                onDelete={handleDelete}
                onRowEditComplete={onRowEditComplete}
                emptyMessage="Еще нет ни одного проекта"
                rowsPerPageOptions={[2, 3, 5]}
            />
        </div>
    );
};

export default ProjectsTable;