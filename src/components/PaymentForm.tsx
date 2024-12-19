import React, {useState} from 'react';
import './PaymentForm.css';
import {Tooltip} from '@mui/material';
import arrowLeft from 'assets/arrow-left.svg';

type FormData = {
  cardNumber: string;
  expiration: string;
  cvc: string;
};

type FormErrors = {
  cardNumber: string;
  expiration: string;
  cvc: string;
};

const PaymentForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    cardNumber: '',
    expiration: '',
    cvc: '',
  });

  const [errors, setErrors] = useState<FormErrors>({
    cardNumber: '',
    expiration: '',
    cvc: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validateInput = (name: keyof FormData, value: string): string => {
    const currentDate = new Date();
    const [month, year] = value.split('/').map(Number);
    const sanitizedValue = value.replace(/\s+/g, '');

    switch (name) {
      case 'cardNumber':
        if (!value) return 'Please enter a Card Number';
        if (!/^\d+$/.test(sanitizedValue)) return 'Please enter a valid Card Number';
        if (sanitizedValue.length !== 16) return 'Card Number should have 16 digits';
        return '';
      case 'expiration':
        if (!value) return 'Please enter an Expiration Date';
        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(value)) return 'Please enter a valid Expiration Date';
        if (year < currentDate.getFullYear() % 100 || (year === currentDate.getFullYear() % 100 && month < currentDate.getMonth() + 1)) {
          return 'Date couldn\'t be in the past';
        }
        return '';
      case 'cvc':
        if (!value) return 'Please enter a CVV';
        if (!/^\d+$/.test(value)) return 'Please enter a valid CVV';
        if (value.length !== 3) return 'CVV should have 3 digits';
        return '';
      default:
        return '';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    const formattedValue = name === 'expiration'
      ? value.replace(/\D/g, '').replace(/^(\d{2})(\d{0,2})$/, '$1/$2')
      : value.replace(/\D/g, '').replace(/(.{4})/g, "$1 ").trim();

    setFormData((prev) => ({...prev, [name]: formattedValue}));
    setErrors((prev) => ({...prev, [name]: ''}));
  };

  const handleSubmit = () => {
    const newErrors = Object.keys(formData).reduce((acc, key) => {
      const name = key as keyof FormData;
      acc[name] = validateInput(name, formData[name]);
      return acc;
    }, {} as FormErrors);

    setErrors(newErrors);

    if (!Object.values(newErrors).some((error) => error)) {
      setLoading(true);
      setSuccess(false);

      setTimeout(() => {
        setLoading(false);
        setSuccess(true);
        setFormData({cardNumber: '', expiration: '', cvc: ''});
        setErrors({cardNumber: '', expiration: '', cvc: ''});

        setTimeout(() => setSuccess(false), 3000);
      }, 2000);
    }
  };
  return (
    <div className="main-block_wrapper mx-auto">
      {success && <div className="success-message">Payment was successful!</div>}

      <header className="header">
        <img className="header__arrow" src={"./assets/arrow-left.svg"} alt="Arrow"/>
        <p className="fw-bold header__title text_dark-grey">Checkout</p>
        <div className="text-end">
          <button className="button p-2 text_light-grey">Eng</button>
          <button className="button p-2 text_dark-grey">Укр</button>
        </div>
      </header>

      <div className="d-flex flex-column flex-lg-row gap-4 gap-lg-5 justify-content-center main-block">
        <div className="position-relative main-block__payment">
          <img className="position-absolute main-block__arrow" src={"./assets/arrow-left.svg"} alt="Arrow"/>
          <p className="fw-bold main-block__payment-title text_dark-grey">Checkout</p>
          <h2 className="mb-0 fw-bold main-block__payment_title text_dark-grey">5 days free</h2>
          <p className="main-block__payment_subtitle text_dark-grey">then 299.99 UAH per 14 days</p>
          <button className="button main-block__apple-pay-btn w-100">
            <img src={"./assets/apple-pay-logo.svg"} alt="Apple Pay"/>
          </button>

          <div className="d-flex justify-content-between align-items-center mb-2 mb-lg-3 gap-3">
            <hr className="flex-grow-1"/>
            <p className="mb-0 text_grey">or pay with card</p>
            <hr className="flex-grow-1"/>
          </div>

          <div className="form-group">
            <label htmlFor="card-number" className="text_grey">Card Number</label>
            <input
              id="card-number"
              name="cardNumber"
              placeholder="1234 1234 1234 1234"
              maxLength={19}
              value={formData.cardNumber}
              onChange={handleChange}
              className={`form-control ${errors.cardNumber ? 'is-invalid' : ''}`}
            />
            <div className="error-container">
              {errors.cardNumber && <p className="error-text">{errors.cardNumber}</p>}
            </div>
          </div>
          <div className="d-flex gap-2">
            <div className="form-group w-50">
              <label htmlFor="expiration" className="text_grey">Expiration Date</label>
              <input
                id="expiration"
                name="expiration"
                placeholder="MM/YY"
                maxLength={5}
                value={formData.expiration}
                onChange={handleChange}
                className={`form-control ${errors.expiration ? 'is-invalid' : ''}`}
              />
              <div className="error-container">
                {errors.expiration && <p className="error-text">{errors.expiration}</p>}
              </div>
            </div>
            <div className="form-group w-50">
              <label htmlFor="cvc" className="text_grey">CVC</label>
              <div className="position-relative">
                <input
                  type="password"
                  id="cvc"
                  name="cvc"
                  placeholder="•••"
                  maxLength={3}
                  value={formData.cvc}
                  onChange={handleChange}
                  className={`form-control ${errors.cvc ? 'is-invalid' : ''}`}
                />
                {!errors.cvc &&
                    <Tooltip title="The 3-digit code on the back of your card" placement="top">
                        <button className="button position-absolute form-group__info-btn">
                            <img src={"./assets/info.svg"} alt="Info"/>
                        </button>
                    </Tooltip>
                }
              </div>
              <div className="error-container">
                {errors.cvc && <p className="error-text">{errors.cvc}</p>}
              </div>
            </div>
          </div>

          <button
            className={`fw-bold w-100 button main-block__pay-btn ${loading ? 'loading' : ''}`}
            onClick={handleSubmit}
          >
            <div className="main-block__pay-btn-content">
              <span className="default-text">Pay 299.99 UAH</span>
              <span className="processing-text">
                <span className="spinner-border spinner-border-sm me-2"></span>
                Processing payment...
              </span>
            </div>
          </button>

          <p className="mb-0 main-block__info-text text_grey">
            You'll have your <span className="fw-bold">Plan Pro during 1 year</span>. After this
            period, your plan will be <span className="fw-bold">automatically renewed</span> with its original price.
          </p>
        </div>

        <div className="main-block__summary">
          <h5 className="fw-bold mb-3 text_dark-grey main-block__summary-title">Order info &lt;= 100 char.</h5>
          <p className="main-block__summary-subtitle">Description &lt;= 400 char.</p>
          <hr/>
          <p className="mb-0 main-block__summary-item text_dark-grey">Lamel Professional Smart Skin Compact Powder</p>
          <p className="main-block__item-info text_medium-grey">Пудра для лица</p>
          <hr/>
          <div className="fw-bold text-end">5 days free</div>
          <div className="main-block__total-info text-end">then 299.99 UAH per 14 days</div>
        </div>
      </div>

      <footer className="d-flex justify-content-center mt-3">
        <p className="mb-0 me-1 footer__text text_grey">Powered by</p>
        <img src={"./assets/solid-logo.svg"} alt="Logo"/>
      </footer>
    </div>
  );
};

export default PaymentForm;
