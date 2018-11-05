import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import {I18nextProvider} from 'react-i18next';
import i18next from 'i18next';
import commonEn from './translation/en/common.json';
import commonFr from './translation/fr/common.json';

i18next.init({
  interpolation: { escapeValue: false },
  lng: 'fr', // language to use
  resources: {
    en: {
      common: commonEn,
    },
    fr: {
      common: commonFr,
    },
  },
});

ReactDOM.render(<I18nextProvider i18n={i18next}>
  <App />
</I18nextProvider>,
document.getElementById('root'));
registerServiceWorker();
