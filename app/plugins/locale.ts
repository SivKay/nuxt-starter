import { COOKIE_KEYS } from "~/constants";

const supportedLocales = ["en", "km"] as const;

type SupportedLocale = (typeof supportedLocales)[number];

function isSupportedLocale(locale: string | null | undefined): locale is SupportedLocale {
  return supportedLocales.includes(locale as SupportedLocale);
}

export default defineNuxtPlugin(async (nuxtApp) => {
  const localeCookie = useCookie<SupportedLocale | null>(COOKIE_KEYS.locale, {
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
  });

  if (isSupportedLocale(localeCookie.value)) {
    await nuxtApp.$i18n.setLocale(localeCookie.value);
  }

  watch(nuxtApp.$i18n.locale, (locale) => {
    if (isSupportedLocale(locale)) {
      localeCookie.value = locale;
    }
  }, { immediate: true });
});
