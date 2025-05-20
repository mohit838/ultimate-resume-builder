# Ultimate Resume Builder

## check-update and install one-liner:

    npx npm-check-updates -u && npm install

## Folder Structure:

        src
    │   ├── api
    │   │   └── axios.ts
    │   ├── App.tsx
    │   ├── assets
    │   ├── auth-helper-wrapper
    │   │   ├── private.tsx
    │   │   ├── protected.tsx
    │   │   └── public.tsx
    │   ├── components
    │   │   ├── layouts
    │   │   │   └── resume-layout.tsx
    │   │   └── ui
    │   │   ├── card.tsx
    │   │   └── loader.tsx
    │   ├── config
    │   │   └── routes.ts
    │   ├── features
    │   │   ├── auth
    │   │   │   ├── login.tsx
    │   │   │   ├── logout.tsx
    │   │   │   ├── otp-verification-page.tsx
    │   │   │   ├── reset-password-request.tsx
    │   │   │   ├── reset-password.tsx
    │   │   │   └── signup.tsx
    │   │   └── resume
    │   │   └── resume.tsx
    │   ├── hooks
    │   │   ├── useForgotPassword.ts
    │   │   ├── useNotification.ts
    │   │   ├── useOtpMutation.ts
    │   │   └── useResetPassword.ts
    │   ├── index.css
    │   ├── main.tsx
    │   ├── pages
    │   │   ├── dashboard
    │   │   │   └── dashboard.tsx
    │   │   ├── not-found
    │   │   │   └── NotFound.tsx
    │   │   └── settings
    │   │   ├── enable-2fa
    │   │   │   └── enable-2fa.tsx
    │   │   └── profile
    │   │   └── profile.tsx
    │   ├── providers
    │   │   └── providers.tsx
    │   ├── routes
    │   │   └── app-routes.tsx
    │   ├── services
    │   │   ├── auth
    │   │   │   ├── login.ts
    │   │   │   ├── otp.ts
    │   │   │   ├── requestForgotPassword.ts
    │   │   │   └── resetPassword.ts
    │   │   ├── endpoints.ts
    │   │   └── resume
    │   ├── stores
    │   │   ├── useAuthStore.ts
    │   │   ├── useResetPassStore.ts
    │   │   └── useSignUpStore.ts
    │   ├── styles
    │   │   └── theme.ts
    │   ├── types
    │   │   └── types.ts
    │   ├── utils
    │   │   └── handleAxiosError.ts
    │   └── vite-env.d.ts
