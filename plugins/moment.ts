import moment from "moment";
import "moment/dist/locale/ru";

export default defineNuxtPlugin((nuxtApp) => {
	moment.locale("ru");
	moment.updateLocale("ru", {
		relativeTime: {
			m: "%d минута",
			h: "%d час",
			d: "%d день",
			M: "%d месяц",
			y: "%d год",
		},
	});

	nuxtApp.provide("moment", moment);
});
