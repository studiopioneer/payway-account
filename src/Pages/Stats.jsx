import React, {useRef, useEffect, useState} from "react";
import {Toast} from 'primereact/toast';
import {Dropdown} from 'primereact/dropdown';
import {useSelector, useDispatch} from 'react-redux';
import {clearToast} from '../ToastSlice';
import StatsTable from "../Components/StatsTable.jsx";

const API_BASE = '/wp-json/payway/v1';

const apiFetch = async (path) => {
    const token = localStorage.getItem('jwtToken');
    const response = await fetch(API_BASE + path, {
        headers: {Authorization: `Bearer ${token}`}
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
};

export default function Stats() {
    const toast = useRef(null);
    const dispatch = useDispatch();
    const {message, severity} = useSelector((state) => state.toast);

    const [selectedMonth, setSelectedMonth] = useState(null);
    const [months, setMonths] = useState([]);
    const [balance, setBalance] = useState(0);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [highlightEarnings, setHighlightEarnings] = useState(false);
    const firstMonthRef = useRef(null);

    useEffect(() => {
        loadInitialData();
    }, []);

    useEffect(() => {
        if (message) {
            toast.current.show({severity, summary: 'Успешно', detail: message, life: 3000});
            setTimeout(() => {dispatch(clearToast());}, 3000);
        }
    }, [message, severity, dispatch]);

    const loadInitialData = async () => {
        setLoading(true);
        try {
            const monthList = await apiFetch('/stats/available-months');
            const formatted = monthList.map((m) => {
                const [year, month] = m.split('-');
                const date = new Date(year, month - 1);
                const label = new Intl.DateTimeFormat('ru-RU', {month: 'long', year: 'numeric'}).format(date);
                return {label: label.charAt(0).toUpperCase() + label.slice(1), value: m};
            });
            setMonths(formatted);
            if (formatted.length > 0) {
                const first = formatted[0].value;
                firstMonthRef.current = first;
                setSelectedMonth(first);
                const [statsData, balData] = await Promise.all([
                    apiFetch(`/stats/get-by-month?month=${first}`),
                    apiFetch(`/stats/monthly-balance?month=${first}`)
                ]);
                setData(statsData);
                setBalance(balData.balance ?? 0);
            }
        } catch (e) {
            console.error('Ошибка при загрузке данных:', e);
        } finally {
            setLoading(false);
        }
    };

    const handleMonthChange = async (e) => {
        const month = e.value;
        setSelectedMonth(month);
        setHighlightEarnings(month !== firstMonthRef.current);
        setLoading(true);
        try {
            const [statsData, balData] = await Promise.all([
                apiFetch(`/stats/get-by-month?month=${month}`),
                apiFetch(`/stats/monthly-balance?month=${month}`)
            ]);
            setData(statsData);
            setBalance(balData.balance ?? 0);
        } catch (e) {
            console.error('Ошибка при загрузке данных:', e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-5">
            <Toast ref={toast}/>
            <div className="text-900 font-semibold lg:text-3xl sm:text-2xl mt-3">
                Статистика
            </div>
            <div className="p-divider p-component p-divider-horizontal p-divider-solid p-divider-left" role="separator">
                <div className="p-divider-content"></div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-3 items-end">
                <div className="col pt-4 lg:text-lg sm:text-sm">
                    Баланс: <span className={balance < 0 ? "text-red-500" : "text-green-500"}>${balance.toFixed(2)}</span>
                </div>
                <div className="flex-col items-end">
                    <Dropdown
                        value={selectedMonth}
                        options={months}
                        onChange={handleMonthChange}
                        placeholder="Выберите месяц"
                        disabled={loading}
                    />
                </div>
            </div>
            {loading ? (
                <div className="text-center">Загрузка...</div>
            ) : (
                <StatsTable data={data} highlightEarnings={highlightEarnings}/>
            )}
        </div>
    );
}
