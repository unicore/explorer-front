import Vue from "vue";
import * as Sentry from "@sentry/vue";
import { Integrations } from "@sentry/tracing";
import config from '@/config'

if (config.prod == true){
  Sentry.init({
    Vue,
    dsn: config.dsn,
    integrations: [new Integrations.BrowserTracing()],

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
    logErrors: true,
    tracingOptions: {
      trackComponents: true,
    },
  })
}