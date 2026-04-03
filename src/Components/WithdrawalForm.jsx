import React, {useState, useRef, useEffect} from 'react';
import {InputNumber} from 'primereact/inputnumber';
import {InputText} from 'primereact/inputtext';
import {Button} from 'primereact/button';
import {InputTextarea} from 'primereact/inputtextarea';
import {Toast} from 'primereact/toast';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import {useDispatch} from 'react-redux'; // ÐÐ¼Ð¿Ð¾ÑÑÐ¸ÑÑÐµÐ¼ useDispatch
import {showToast} from '../ToastSlice';
import {apiFetch} from '../assets/Api'; // ÐÐ¼Ð¿Ð¾ÑÑÐ¸ÑÑÐµÐ¼ action

const CRYPTO_COMMISSION_RATE = 11; // ÐÐ¾Ð¼Ð¸ÑÑÐ¸Ñ Ð·Ð° ÐºÑÐ¸Ð¿ÑÐ¾Ð²Ð°Ð»ÑÑÑ Ð² Ð¿ÑÐ¾ÑÐµÐ½ÑÐ°Ñ
const SWIFT_COMMISSION_RATE = 12; // ÐÐ¾Ð¼Ð¸ÑÑÐ¸Ñ Ð·Ð° Swift Ð² Ð¿ÑÐ¾ÑÐµÐ½ÑÐ°Ñ
const CARDS_COMMISSION_RATE = 15; // ÐÐ¾Ð¼Ð¸ÑÑÐ¸Ñ Ð·Ð° Visa/MasterCard/ÐÐÐ  Ð² Ð¿ÑÐ¾ÑÐµÐ½ÑÐ°Ñ

const WithdrawalForm = () => {
    const [amount, setAmount] = useState(0);
    const [details, setDetails] = useState('');
    const [comments, setComments] = useState('');
    const [paymentType, setPaymentType] = useState('swift');
    const toast = useRef(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
        const [balance, setBalance] = useState(0);
        const [balanceLoaded, setBalanceLoaded] = useState(false);

        // Загрузка баланса пользователя
        useEffect(() => {
            const fetchBalance = async () => {
                try {
                    const now = new Date();
                    const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
                    const data = await apiFetch(`/stats/monthly-balance?month=${month}`);
                    if (data && data.balance !== undefined) {
                        setBalance(parseFloat(data.balance));
                    }
                    setBalanceLoaded(true);
                } catch (err) {
                    console.error('Failed to fetch balance:', err);
                    setBalanceLoaded(true);
                }
            };
            fetchBalance();
        }, []); // Ð¥ÑÐº Ð´Ð»Ñ Ð¾ÑÐ¿ÑÐ°Ð²ÐºÐ¸ actions

    const paymentOptions = [
        {
            value: 'swift',
            label: `Swift - ${SWIFT_COMMISSION_RATE}%`,
            iconClass: 'pi pi-globe',
            description: 'ÐÑÐ¿Ð»Ð°ÑÐ° Ð½Ð° Ð²Ð°Ñ Ð±Ð°Ð½ÐºÐ¾Ð²ÑÐºÐ¸Ð¹ ÑÑÑÑ Ð² Ð´Ð¾Ð»Ð»Ð°ÑÐ°Ñ Ð¸Ð»Ð¸ ÐµÐ²ÑÐ¾. ÐÐµÑÐµÐ²Ð¾Ð´Ñ Ð½Ðµ Ð¾ÑÑÑÐµÑÑÐ²Ð»ÑÑÑÑÑ Ð² ÑÑÑÐ°Ð½Ñ, Ð¿Ð¾Ð¿Ð°Ð²ÑÐ¸Ðµ Ð¿Ð¾Ð´ ÑÐ°Ð½ÐºÑÐ¸Ð¸, Ð²ÐºÐ»ÑÑÐ°Ñ Ð Ð¾ÑÑÐ¸Ñ. ÐÐ´Ð½Ð°ÐºÐ¾ Ð²Ñ Ð¼Ð¾Ð¶ÐµÑÐµ Ð·Ð°ÐºÐ°Ð·Ð°ÑÑ Ð¿ÐµÑÐµÐ²Ð¾Ð´ Ð² Ð´ÑÑÐ³Ð¸Ðµ ÑÑÑÐ°Ð½Ñ, ÑÐ°ÐºÐ¸Ðµ ÐºÐ°Ðº Ð³Ð¾ÑÑÐ´Ð°ÑÑÑÐ²Ð° ÐÐ¡, ÐÐ°Ð·Ð°ÑÑÑÐ°Ð½, ÐÑÑÐ·Ð¸Ñ Ð¸ Ñ.Ð´. ÐÑ Ð½Ðµ Ð²Ð·Ð¸Ð¼Ð°ÐµÐ¼ ÐºÐ¾Ð¼Ð¸ÑÑÐ¸Ñ Ð·Ð° Ð¿ÐµÑÐµÐ²Ð¾Ð´, Ð½Ð¾ ÐµÑ Ð¼Ð¾Ð¶ÐµÑ ÑÐ´ÐµÑÐ¶Ð°ÑÑ Ð²Ð°Ñ Ð±Ð°Ð½Ðº Ð¸Ð»Ð¸ Ð±Ð°Ð½Ðº-ÐºÐ¾ÑÑÐµÑÐ¿Ð¾Ð½Ð´ÐµÐ½Ñ, ÑÐ°Ðº ÑÑÐ¾ ÑÑÐ¾ÑÐ½Ð¸ÑÐµ ÑÑÐ¾Ñ Ð¼Ð¾Ð¼ÐµÐ½Ñ Ñ ÑÐ²Ð¾ÐµÐ³Ð¾ ÑÐ¸Ð½Ð°Ð½ÑÐ¾Ð²Ð¾Ð³Ð¾ ÑÑÑÐµÐ¶Ð´ÐµÐ½Ð¸Ñ.',
        },
        {
            value: 'cards',
            label: `Visa, MasterCard, ÐÐÐ  - ${CARDS_COMMISSION_RATE}%`,
            iconClass: 'pi pi-credit-card',
            description: 'ÐÑÐ¿Ð»Ð°ÑÑ Ð½Ð° ÐºÐ°ÑÑÑ Visa, Mastercard, ÐÐ¸Ñ Ð»ÑÐ±ÑÑ ÑÑÑÐ°Ð½, Ð² Ð Ð¾ÑÑÐ¸Ð¸ Ð² ÑÑÐ±Ð»ÑÑ Ð½Ð° Ð»ÑÐ±Ð¾Ð¹ Ð±Ð°Ð½Ðº Ð±ÐµÐ· Ð¾Ð³ÑÐ°Ð½Ð¸ÑÐµÐ½Ð¸Ð¹. ÐÐ»Ñ Ð²ÑÐ²Ð¾Ð´Ð° Ð² ÑÐ¸Ð°ÑÐ½Ð¾Ð¹ Ð²Ð°Ð»ÑÑÐµ Ð¼Ð¾Ð¶ÐµÑ Ð¿Ð¾ÑÑÐµÐ±Ð¾Ð²Ð°ÑÑÑÑ Ð²ÐµÑÐ¸ÑÐ¸ÐºÐ°ÑÐ¸Ñ Ð»Ð¸ÑÐ½Ð¾ÑÑÐ¸ Ð¿Ð¾Ð»ÑÑÐ°ÑÐµÐ»Ñ Ð¿Ð¾ Ð´Ð¾ÐºÑÐ¼ÐµÐ½ÑÐ°Ð¼.',
        },
        {
            value: 'cryptocurrency',
            label: `ÐÑÐ¸Ð¿ÑÐ¾Ð²Ð°Ð»ÑÑÐ° (USDT TRC 20) - ${CRYPTO_COMMISSION_RATE}%`,
            iconClass: 'pi pi-wallet',
            description: 'ÐÑÐ¿Ð»Ð°ÑÐ° Ð² ÑÑÐµÐ¹Ð±Ð»ÐºÐ¾Ð¸Ð½Ðµ USDT TRC20. Ð ÑÐ¾Ð¼ ÐºÐ°Ðº Ð·Ð°ÑÐµÐ³Ð¸ÑÑÑÐ¸ÑÐ¾Ð²Ð°ÑÑÑÑ Ð½Ð° ÐºÑÐ¸Ð¿ÑÐ¾Ð±Ð¸ÑÐ¶Ðµ Ð¸ Ð½Ð°ÑÐ°ÑÑ Ð¿Ð¾Ð»ÑÑÐ°ÑÑ Ð¿Ð»Ð°ÑÐµÐ¶Ð¸, ÑÐ¸ÑÐ°Ð¹ÑÐµ Ð² Ð½Ð°ÑÐµÐ¼ Ð±Ð»Ð¾Ð³Ðµ. ÐÐ¸Ð½Ð¸Ð¼Ð°Ð»ÑÐ½Ð°Ñ ÑÑÐ¼Ð¼Ð° Ðº Ð²ÑÐ²Ð¾Ð´Ñ - 20 ÐÐ²ÑÐ¾ Ð¸Ð»Ð¸ 30 Ð´Ð¾Ð»Ð»Ð°ÑÐ¾Ð² Ð¡Ð¨Ð Ð¡Ð¼Ð¾ÑÑÐ¸ÑÐµ Ð½Ð°Ñ Ð³Ð°Ð¹Ð´',
        },
    ];

    // Ð Ð°ÑÑÑÑ ÐºÐ¾Ð¼Ð¸ÑÑÐ¸Ð¸ Ð´Ð»Ñ Swift
    const swiftCommission = (amount && paymentType === 'swift')
        ? parseFloat((amount * SWIFT_COMMISSION_RATE / 100).toFixed(2))
        : 0;
    const amountAfterSwiftCommission = (amount && paymentType === 'swift')
        ? parseFloat((amount - swiftCommission).toFixed(2))
        : 0;

    // Ð Ð°ÑÑÑÑ ÐºÐ¾Ð¼Ð¸ÑÑÐ¸Ð¸ Ð´Ð»Ñ Visa/MasterCard/ÐÐÐ 
    const cardsCommission = (amount && paymentType === 'cards')
        ? parseFloat((amount * CARDS_COMMISSION_RATE / 100).toFixed(2))
        : 0;
    const amountAfterCardsCommission = (amount && paymentType === 'cards')
        ? parseFloat((amount - cardsCommission).toFixed(2))
        : 0;

    // Ð Ð°ÑÑÑÑ ÐºÐ¾Ð¼Ð¸ÑÑÐ¸Ð¸ Ð´Ð»Ñ ÐºÑÐ¸Ð¿ÑÐ¾Ð²Ð°Ð»ÑÑÑ
    const cryptoCommission = (amount && paymentType === 'cryptocurrency')
        ? parseFloat((amount * CRYPTO_COMMISSION_RATE / 100).toFixed(2))
        : 0;
    const amountAfterCommission = (amount && paymentType === 'cryptocurrency')
        ? parseFloat((amount - cryptoCommission).toFixed(2))
        : 0;

    const handleSubmit = async (e) => {
        e.preventDefault();
        // ÐÐ°Ð½Ð½ÑÐµ Ð´Ð»Ñ Ð¾ÑÐ¿ÑÐ°Ð²ÐºÐ¸ Ð½Ð° ÑÐµÑÐ²ÐµÑ
        const formData = {
            amount,
            payment_details: details,
            comments,
            payment_type: paymentType,
        };

        try {
            // ÐÑÐ¿ÑÐ°Ð²Ð»ÑÐµÐ¼ POST-Ð·Ð°Ð¿ÑÐ¾Ñ Ð½Ð° WordPress REST API
            const response = await axios.post('/wp-json/payway/v1/withdrawal', formData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`, // ÐÑÐ»Ð¸ ÑÑÐµÐ±ÑÐµÑÑÑ Ð°Ð²ÑÐ¾ÑÐ¸Ð·Ð°ÑÐ¸Ñ
                },
            });
            // ÐÑÐ¸ÑÑÐºÐ° ÑÐ¾ÑÐ¼Ñ Ð¿Ð¾ÑÐ»Ðµ ÑÑÐ¿ÐµÑÐ½Ð¾Ð¹ Ð¾ÑÐ¿ÑÐ°Ð²ÐºÐ¸
            setAmount(0);
            setDetails('');
            setComments('');
            setPaymentType('swift');
            // ÐÑÐ¿ÑÐ°Ð²Ð»ÑÐµÐ¼ Ð´ÐµÐ¹ÑÑÐ²Ð¸Ðµ (action) Ð´Ð»Ñ Ð¿Ð¾ÐºÐ°Ð·Ð° ÑÐ¾Ð¾Ð±ÑÐµÐ½Ð¸Ñ
            dispatch(showToast({
                message: 'ÐÐ°ÑÐ²ÐºÐ° Ð½Ð° Ð²ÑÐ²Ð¾Ð´ ÑÑÐµÐ´ÑÑÐ² ÑÑÐ¿ÐµÑÐ½Ð¾ ÑÐ¾Ð·Ð´Ð°Ð½Ð°!',
                severity: 'success',
            }));

            // ÐÐµÑÐµÐ½Ð°Ð¿ÑÐ°Ð²Ð»ÑÐµÐ¼ Ð½Ð° Ð³Ð»Ð°Ð²Ð½ÑÑ ÑÑÑÐ°Ð½Ð¸ÑÑ
            navigate('/account');
        } catch (error) {
            // ÐÐ±ÑÐ°Ð±Ð¾ÑÐºÐ° Ð¾ÑÐ¸Ð±Ð¾Ðº
            console.error('ÐÑÐ¸Ð±ÐºÐ° Ð¿ÑÐ¸ Ð¾ÑÐ¿ÑÐ°Ð²ÐºÐµ ÑÐ¾ÑÐ¼Ñ:', error);
            if (error.response) {
                toast.current.show({
                    severity: 'error',
                    summary: 'ÐÑÐ¸Ð±ÐºÐ°',
                    detail: error.response.data.message || 'ÐÑÐ¾Ð¸Ð·Ð¾ÑÐ»Ð° Ð¾ÑÐ¸Ð±ÐºÐ° Ð¿ÑÐ¸ Ð¾ÑÐ¿ÑÐ°Ð²ÐºÐµ ÑÐ¾ÑÐ¼Ñ.',
                    life: 3000,
                });
            } else {
                toast.current.show({
                    severity: 'error',
                    summary: 'ÐÑÐ¸Ð±ÐºÐ°',
                    detail: 'Ð¡ÐµÑÐ²ÐµÑ Ð½ÐµÐ´Ð¾ÑÑÑÐ¿ÐµÐ½. ÐÐ¾Ð¿ÑÐ¾Ð±ÑÐ¹ÑÐµ Ð¿Ð¾Ð·Ð¶Ðµ.',
                    life: 3000,
                });
            }
        }
    };

    return (
        <div>
            <Toast ref={toast}/>
            <form onSubmit={handleSubmit} className="payway-draw">
                <div className="pt-6 w-full">
                    <div className="grid formgrid p-fluid mb-4">
                        <div className="col-12 md:col-6">
                            <div className="flex flex-column gap-3">
                                <label htmlFor="amount" className="block">
                                    Ð¡ÑÐ¼Ð¼Ð° Ðº Ð²ÑÐ²Ð¾Ð´Ñ
                                </label>
                                <InputNumber
                                    id="amount"
                                    className="w-full"
                                    value={amount}
                                    onValueChange={(e) => setAmount(e.value)}
                                    required
                                />
                            </div>
                            <div className="flex flex-column gap-3 mt-4">
                                <label htmlFor="details" className="block">
                                    Ð ÐµÐºÐ²Ð¸Ð·Ð¸ÑÑ
                                </label>
                                <InputText
                                    id="details"
                                    className="w-full"
                                    type="text"
                                    value={details}
                                    onChange={(e) => setDetails(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="col-12 md:col-6">
                            <div className="flex flex-column gap-3 h-full">
                                <label htmlFor="comments" className="block">
                                    ÐÑÐ¸Ð¼ÐµÑÐ°Ð½Ð¸Ðµ (ÐÐµÐ¾Ð±ÑÐ·Ð°ÑÐµÐ»ÑÐ½Ð¾)
                                </label>
                                <InputTextarea
                                    id="comments"
                                    className="w-full flex-grow-1 h-full"
                                    placeholder="ÐÑÑÐ°Ð²ÑÑÐµ ÐºÐ¾Ð¼Ð¼ÐµÐ½ÑÐ°ÑÐ¸Ð¹"
                                    value={comments}
                                    onChange={(e) => setComments(e.target.value)}
                                    autoResize={false}
                                />
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="text-900 text-xl mb-3 text-left font-medium">
                            ÐÑÐ±ÐµÑÐ¸ÑÐµ ÑÐ¿Ð¾ÑÐ¾Ð± Ð¾Ð¿Ð»Ð°ÑÑ
                        </div>
                        {paymentOptions.map((option) => (
                            <div
                                key={option.value}
                                className={`surface-card mb-2 border-2 p-3 flex flex-column align-items-start cursor-pointer ${
                                    paymentType === option.value ? 'border-primary' : 'surface-border'
                                }`}
                                onClick={() => setPaymentType(option.value)}
                            >
                                <div className="flex align-items-center w-full">
                                    <div
                                        className={`p-radiobutton p-component mr-3 ${
                                            paymentType === option.value ? 'p-radiobutton-checked' : ''
                                        }`}
                                    >
                                        <div className="p-hidden-accessible">
                                            <input
                                                type="radio"
                                                name="payment_type"
                                                value={option.value}
                                                checked={paymentType === option.value}
                                                readOnly
                                            />
                                        </div>
                                        <div
                                            className={`p-radiobutton-box ${
                                                paymentType === option.value ? 'p-highlight' : ''
                                            }`}
                                        >
                                            <div className="p-radiobutton-icon"></div>
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-medium">{option.label}</div>
                                    </div>
                                    <div className="ml-auto flex flex-nowrap">
                                        <i className={`${option.iconClass} text-xl`}/>
                                    </div>
                                </div>
                                {paymentType === option.value && (
                                    <div className="mt-3 text-sm text-400 fadein animation-duration-300">
                                        {option.description}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    {paymentType === 'swift' && amount > 0 && (
                        <div className="surface-card border-1 surface-border p-3 mt-3 border-round">
                            <div className="flex justify-content-between mb-2">
                                <span className="text-600">Ð¡ÑÐ¼Ð¼Ð° Ðº Ð²ÑÐ²Ð¾Ð´Ñ:</span>
                                <span className="font-medium">{amount}</span>
                            </div>
                            <div className="flex justify-content-between mb-2">
                                <span className="text-600">ÐÐ¾Ð¼Ð¸ÑÑÐ¸Ñ ({SWIFT_COMMISSION_RATE}%):</span>
                                <span className="font-medium text-red-500">- {swiftCommission}</span>
                            </div>
                            <div className="flex justify-content-between border-top-1 surface-border pt-2">
                                <span className="text-900 font-bold">ÐÑ Ð¿Ð¾Ð»ÑÑÐ¸ÑÐµ:</span>
                                <span className="text-900 font-bold">{amountAfterSwiftCommission}</span>
                            </div>
                        </div>
                    )}
                    {paymentType === 'cards' && amount > 0 && (
                        <div className="surface-card border-1 surface-border p-3 mt-3 border-round">
                            <div className="flex justify-content-between mb-2">
                                <span className="text-600">Ð¡ÑÐ¼Ð¼Ð° Ðº Ð²ÑÐ²Ð¾Ð´Ñ:</span>
                                <span className="font-medium">{amount}</span>
                            </div>
                            <div className="flex justify-content-between mb-2">
                                <span className="text-600">ÐÐ¾Ð¼Ð¸ÑÑÐ¸Ñ ({CARDS_COMMISSION_RATE}%):</span>
                                <span className="font-medium text-red-500">- {cardsCommission}</span>
                            </div>
                            <div className="flex justify-content-between border-top-1 surface-border pt-2">
                                <span className="text-900 font-bold">ÐÑ Ð¿Ð¾Ð»ÑÑÐ¸ÑÐµ:</span>
                                <span className="text-900 font-bold">{amountAfterCardsCommission}</span>
                            </div>
                        </div>
                    )}
                    {paymentType === 'cryptocurrency' && amount > 0 && (
                        <div className="surface-card border-1 surface-border p-3 mt-3 border-round">
                            <div className="flex justify-content-between mb-2">
                                <span className="text-600">Ð¡ÑÐ¼Ð¼Ð° Ðº Ð²ÑÐ²Ð¾Ð´Ñ:</span>
                                <span className="font-medium">{amount}</span>
                            </div>
                            <div className="flex justify-content-between mb-2">
                                <span className="text-600">ÐÐ¾Ð¼Ð¸ÑÑÐ¸Ñ ({CRYPTO_COMMISSION_RATE}%):</span>
                                <span className="font-medium text-red-500">- {cryptoCommission}</span>
                            </div>
                            <div className="flex justify-content-between border-top-1 surface-border pt-2">
                                <span className="text-900 font-bold">ÐÑ Ð¿Ð¾Ð»ÑÑÐ¸ÑÐµ:</span>
                                <span className="text-900 font-bold">{amountAfterCommission}</span>
                            </div>
                        </div>
                    )}
                </div>
                {balanceLoaded && (
                    <div className={`text-sm mb-2 font-semibold ${balance <= 0 ? 'text-red-500' : 'text-green-500'}`}>
                        Ваш баланс: ${balance.toFixed(2)}
                    </div>
                )}
                {balanceLoaded && amount > balance && (
                    <div className="text-sm text-red-500 mb-2">
                        Недостаточно средств для создания заявки
                    </div>
                )}
                <Button
                    type="submit"
                    disabled={!balanceLoaded || amount > balance || balance <= 0}
                    label="Ð¡Ð¾Ð·Ð´Ð°ÑÑ Ð·Ð°ÑÐ²ÐºÑ"
                    className="mt-3 bg-blue-500 hover:bg-blue-600 border-blue-600 hover:border-blue-700"
                />
            </form>
        </div>
    );
};

export default WithdrawalForm;
