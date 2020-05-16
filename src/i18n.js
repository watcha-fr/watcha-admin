import { initReactI18next } from "react-i18next";
import i18n from "i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import moment from "moment";
import "moment/locale/fr";

const mxLanguageDetector = {
    name: "mxLocalSettings",

    lookup(options) {
        const rawValue = localStorage.getItem("mx_local_settings");
        if (rawValue) {
            const localSettings = JSON.parse(rawValue);
            return localSettings.language;
        }
    },

    cacheUserLanguage(lng, options) {
        const rawValue = localStorage.getItem("mx_local_settings");
        const localSettings = rawValue ? JSON.parse(rawValue) : {};
        localSettings["language"] = lng;
        localStorage.setItem(
            "mx_local_settings",
            JSON.stringify(localSettings)
        );
    },
};

const languageDetector = new LanguageDetector();
languageDetector.addDetector(mxLanguageDetector);

i18n
    // load translation using http -> see /public/locales (i.e. https://github.com/i18next/react-i18next/tree/master/example/react/public/locales)
    // learn more: https://github.com/i18next/i18next-http-backend
    .use(Backend)
    // detect user language
    // learn more: https://github.com/i18next/i18next-browser-languageDetector
    .use(languageDetector)
    // pass the i18n instance to react-i18next.
    .use(initReactI18next)
    // init i18next
    // for all options read: https://www.i18next.com/overview/configuration-options
    .init({
        debug: false,
        fallbackLng: "en",
        ns: ["common", "dashboardTab", "usersTab", "roomsTab", "monitoringTab"],
        defaultNS: "common",
        interpolation: {
            escapeValue: false, // not needed for react as it escapes by default
        },
        backend: { loadPath: "/admin/locales/{{lng}}/{{ns}}.json" },
        detection: {
            order: ["mxLocalSettings", "navigator", "subdomain"],
            caches: ["mxLocalSettings"],
        },
    });

i18n.on("languageChanged", lng => moment.locale(lng));

export default i18n;
