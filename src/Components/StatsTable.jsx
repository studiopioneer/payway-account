import React from 'react';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';

const StatsTable = ({data = [], highlightEarnings = false}) => {
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
            header: 'Период',
            sortable: true,
            style: {minWidth: '15rem'},
            body: (rowData) => `${formatDate(rowData.date_start)} - ${formatDate(rowData.date_end)}`,
        },
        {field: 'project_url', header: 'Проект', sortable: false, style: {minWidth: '20rem'}},
        {
            field: 'estimated_earnings_usd',
            header: 'Заработано ($)',
            sortable: true,
            style: {minWidth: '11rem', backgroundColor: highlightEarnings ? '#f0f8ff' : 'transparent'},
        },
        {field: 'page_views', header: 'Просмотры страниц', sortable: true, style: {minWidth: '13rem'}},
        {field: 'page_rpm_usd', header: 'RPM страницы ($)', sortable: true, style: {minWidth: '13rem'}},
        {field: 'impressions', header: 'Показы', sortable: true, style: {minWidth: '10rem'}},
        {field: 'impression_rpm_usd', header: 'RPM показов ($)', sortable: true, style: {minWidth: '13rem'}},
        {field: 'active_view_viewable', header: 'Активные просмотры (%)', sortable: true, style: {minWidth: '15rem'}},
        {field: 'clicks', header: 'Клики', sortable: true, style: {minWidth: '6rem'}},
    ];

    return (
        <div className="p-card p-4">
            <DataTable
                value={data}
                paginator
                rows={10}
                rowsPerPageOptions={[5, 10, 25]}
                emptyMessage="Еще нет статистики"
                scrollable
                className="text-sm"
            >
                {columns.map((col) => (
                    <Column
                        key={col.field}
                        field={col.field}
                        header={col.header}
                        body={col.body}
                        sortable={col.sortable}
                        style={{...col.style, textAlign: 'left', verticalAlign: 'top'}}
                        headerStyle={{textAlign: 'left'}}
                        bodyStyle={{textAlign: 'left', verticalAlign: 'top'}}
                    />
                ))}
            </DataTable>
        </div>
    );
};

export default StatsTable;
