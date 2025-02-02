# Project Setup Instructions

Follow these steps to set up and run the project locally:

## Prerequisites

-   Ensure you have [Node.js](https://nodejs.org/) installed on your machine.
-   Optionally, install [pnpm](https://pnpm.io/installation) for faster package management.

## Setup Steps

1. **Clone the Repository:**

    ```
    git clone <repository-url>
    ```

2. **Navigate to the Root Directory:**

    ```
    cd <project-directory>
    ```

3. **Install Package Manager (Optional):**
   If you prefer `pnpm`, install it using:

    ```
    npm install -g pnpm
    ```

    Otherwise, you can proceed with `npm`.

4. **Install Dependencies:**

    ```
    pnpm install
    ```

    or

    ```
    npm install
    ```

5. **Build the Project:**

    ```
    pnpm build
    ```

    or

    ```
    npm run build
    ```

6. **Run the Project:**

    - For local development:
        ```
        pnpm dev
        ```
        or
        ```
        npm run dev
        ```
    - For production mode:
        ```
        pnpm start
        ```
        or
        ```
        npm start
        ```

7. **Testing:**
    ```
    pnpm test
    ```
    or
    ```
    npm test
    ```

## Important Notes

-   Ensure you provide the necessary environment files before running the project:
    -   `.env` for local development
    -   `.env.test` for running tests
