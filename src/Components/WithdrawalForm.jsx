import React, {useState, useRef} from 'react';
import {InputNumber} from 'primereact/inputnumber';
import {InputText} from 'primereact/inputtext';
import {Button} from 'primereact/button';
import {InputTextarea} from 'primereact/inputtextarea';
import {Toast} from 'primereact/toast';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import {useDispatch} from 'react-redux'; // Импортируем useDispatch
import {showToast} from '../ToastSlice'; // Импортируем action

const CRYPTO_COMMISSION_RATE = 11; // Комиссия за криптовалюту в процентах

const WithdrawalForm = () => {
    const [amount, setAmount] = useState(0);
    const [details, setDetails] = useState('');
    const [comments, setComments] = useState('');
    const [paymentType, setPaymentType] = useState('swift');
    const toast = useRef(null);
    const navigate = useNavigate();
    const dispatch = useDispatch(); // Хук для отправки actions

    const paymentOptions = [
        {
            value: 'swift',
            label: 'Swift',
            iconClass: 'pi pi-globe',
            description: 'Выплата на ваш банковский счёт в долларах или евро. Переводы не осуществляются в страны, попавшие под санкции, включая Россию. Однако вы можете заказать перевод в другие страны, такие как государства ЕС, Казахстан, Грузия и т.д. Мы не взимаем комиссию за перевод, но её может удержать ваш банк или банк-корреспондент, так что уточните этот момент у своего финансового учреждения.',
        },
        {
            value: 'cards',
            label: 'Visa, MasterCard, МИР',
            iconClass: 'pi pi-credit-card',
            description: 'Выплаты на карты Visa, Mastercard, Мир любых стран, в России в рублях на любой банк без ограничений. Для вывода в фиатной валюте может потребоваться верификация личности получателя по документам.',
        },
        {
            value: 'cryptocurrency',
            label: `Криптовалюта (USDT TRC 20) - ${CRYPTO_COMMISSION_RATE}%`,
            iconClass: 'pi pi-wallet',
            description: 'Выплата в стейблкоине USDT TRC20. О том как зарегистрироваться на криптобирже и начать получать платежи, читайте в нашем блоге. Минимальная сумма к выводу - 20 Евро или 30 долларов США Смотрите наш гайд',
        },
    ];

    // Расчёт комиссии для криптовалюты
    const cryptoCommission = (amount && paymentType === 'cryptocurrency')
        ? parseFloat((amount * CRYPTO_COMMISSION_RATE / 100).toFixed(2))
        : 0;
    const amountAfterCommission = (amount && paymentType === 'cryptocurrency')
        ? parseFloat((amount - cryptoCommission).toFixed(2))
        : 0;

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Данные для отправки на сервер
        const formData = {
            amount,
            payment_details: details,
            comments,
            payment_type: paymentType,
        };

        try {
            // Отправляем POST-запрос на WordPress REST API
            const response = await axios.post('/wp-json/payway/v1/withdrawal', formData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`, // Если требуется авторизация
                },
            });
            // Очистка формы после успешной отправки
            setAmount(0);
            setDetails('');
            setComments('');
            setPaymentType('swift');
            // Отправляем действие (action) для показа сообщения
            dispatch(showToast({
                message: 'Заявка на вывод средств успешно создана!',
                severity: 'success',
            }));

            // Перенаправляем на главную страницу
            navigate('/account');
        } catch (error) {
            // Обработка ошибок
            console.error('Ошибка при отправке формы:', error);
            if (error.response) {
                toast.current.show({
                    severity: 'error',
                    summary: 'Ошибка',
                    detail: error.response.data.message || 'Произошла ошибка при отправке формы.',
                    life: 3000,
                });
            } else {
                toast.current.show({
                    severity: 'error',
                    summary: 'Ошибка',
                    detail: 'Сервер недоступен. Попробуйте позже.',
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
                                    Сумма к выводу
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
                                    Реквизиты
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
                                    Примечание (Необязательно)
                                </label>
                                <InputTextarea
                                    id="comments"
                                    className="w-full flex-grow-1 h-full"
                                    placeholder="Оставьте комментарий"
                                    value={comments}
                                    onChange={(e) => setComments(e.target.value)}
                                    autoResize={false}
                                />
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="text-900 text-xl mb-3 text-left font-medium">
                            Выберите способ оплаты
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
                    {paymentType === 'cryptocurrency' && amount > 0 && (
                        <div className="surface-card border-1 surface-border p-3 mt-3 border-round">
                            <div className="flex justify-content-between mb-2">
                                <span className="text-600">Сумма к выводу:</span>
                                <span className="font-medium">{amount}</span>
                            </div>
                            <div className="flex justify-content-between mb-2">
                                <span className="text-600">Комиссия ({CRYPTO_COMMISSION_RATE}%):</span>
                                <span className="font-medium text-red-500">- {cryptoCommission}</span>
                            </div>
                            <div className="flex justify-content-between border-top-1 surface-border pt-2">
                                <span className="text-900 font-bold">Вы получите:</span>
                                <span className="text-900 font-bold">{amountAfterCommission}</span>
                            </div>
                        </div>
                    )}
                </div>
                <Button
                    type="submit"
                    label="Создать заявку"
                    className="mt-3 bg-blue-500 hover:bg-blue-600 border-blue-600 hover:border-blue-700"
                />
            </form>
        </div>
    );
};

export default WithdrawalForm;