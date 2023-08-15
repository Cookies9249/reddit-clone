# Reddit

A Reddit clone built from scratch using React, Firebase, Next.js, Chakra UI, and TypeScript. The application features both front and back end development, including user authentication, Firestore database, cloud functions, security rules, Transactions, deployment, and more.

Created using a [YouTube video](https://www.youtube.com/watch?v=rCm5RVYKWVg) tutorial from freeCodeCamp.org.

## App Requirements

The app was built using Next.js, React.js, Firebase, Chakra UI, TypeScript, and Recoil. Setup for these frameworks is required for the functionality of the app.

### Getting Started with Next.js

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app). To get started, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

To learn more about Next.js, take a look at the following resources:

* [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
* [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
* [Next.js 13](https://nextjs.org/docs/pages/building-your-application/upgrading/app-router-migration)
* [Next.js Layouts](https://nextjs.org/docs/pages/building-your-application/routing/pages-and-layouts)

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

### Required Installations

The following `npm` installations are required to run this project.

* Chakra Setup: `npm i @chakra-ui/react @chakra-ui/next-js @emotion/react @emotion/styled framer-motion`
* Fonts and icons: `npm i @fontsource/open-sans @chakra-ui/icons react-icons`
* Firebase: `npm i firebase react-firebase-hooks`
* Recoil: `npm i recoil`
* Extras: `npm i moment safe-json-stringify`

### Chakra UI

Chakra UI was used for designing the UI of the project. The documentation for Chakra components used in this project are found below:

* [Chakra Setup](https://chakra-ui.com/getting-started/nextjs-guide)
* [Chakra Theme](https://chakra-ui.com/docs/styled-system/customize-theme)
* [Chakra Fonts](https://chakra-ui.com/community/recipes/using-fonts)
* [Chakra Input](https://chakra-ui.com/docs/components/input)
* [Chakra Icons](https://chakra-ui.com/docs/components/icon)
* [Chakra Modals](https://v1.chakra-ui.com/docs/components/overlay/modal)

### Recoil

Recoil was used for global state management. Read the documentation below:

* [Recoil Documentation](https://recoiljs.org/)

#### Firebase

Firebase was used for user authentication, with the aid of `react-firebase-hooks`.

* [Firebase](https://firebase.google.com/)
* [React-Firebase Hooks](https://www.npmjs.com/package/react-firebase-hooks)

### Bug Fixes

Module not found: Can't resolve 'encoding' in '@\node_modules\node-fetch\lib'

Solution: `npm install encoding`


`npm i safe-json-stringify`