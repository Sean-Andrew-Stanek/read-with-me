# Read With Me

## About the Project

Read With Me is a collaborative portfolio project for CareerFoundry students to showcase their skills in Next.js, React, and TypeScript. This project is designed for learning, contributing, and gaining real-world experience in a team setting.

## Getting Started

### 1. Clone the Repository

Make sure you're branching from the develop branch:

```
git clone https://github.com/YOUR-USERNAME/read-with-me.git
cd read-with-me
git checkout develop
```

## Getting Started

### 2. Install Dependencies

`npm install`

### 3. Configure environmental variables

AUTH_SECRET - Production only NextAuth number
NEXTAUTH_URL - NextAuth redirect url

AUTH_GOOGLE_ID - Google oAuth Id
AUTH_GOOGLE_SECRET - Google oAuth Secret

### 3. Run the Project

`npm run dev`

This starts the development server at http://localhost:3000/.

## Contribution Guidelines

- Always create a new branch from `develop` before working on any feature.
- Follow the Prettier + ESLint formatting rules.
- Open a Pull Request (PR) to merge your changes.

## Getting Access & Collaboration

If you’d like to contribute, **contact the repo admin** for access. You can request access by:

- Sending a message to the **repo admin** on GitHub.
- Posting in the **Discord channel** and tagging an admin.
- Providing your GitHub username to be added as a collaborator.

Once you have access, you can join the discussion in Discord and start contributing to the project.

## Getting API KEY for Gemini

- In https://aistudio.google.com choose your project
- Generate API KEY
- Copy the key
- Save the key as GEMINI_API_KEY in .env file
