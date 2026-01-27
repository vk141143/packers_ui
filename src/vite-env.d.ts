/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_STRIPE_SECRET_KEY: string
  readonly VITE_GCP_PROJECT_ID: string
  readonly VITE_GCP_CREDENTIALS: string
  readonly VITE_GCS_BUCKET_NAME: string
  readonly VITE_TWILIO_ACCOUNT_SID: string
  readonly VITE_TWILIO_AUTH_TOKEN: string
  readonly VITE_TWILIO_WHATSAPP_NUMBER: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
