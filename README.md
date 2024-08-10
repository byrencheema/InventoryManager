# Simple Inventory Manager

A web-based application built with Next.js and Material-UI (MUI) that provides a straightforward interface for managing inventory. Users can add, remove, and search for items efficiently, with changes reflected in real-time through Firebase.

## Features

- **Add Items:** Dynamically add items to the inventory with a specified quantity.
- **Remove Items:** Decrement the quantity of items, with automatic removal from the inventory if the quantity reaches zero.
- **Search Functionality:** Search through the inventory using item names.
- **Real-time Updates:** Uses Firebase to store and retrieve inventory data, ensuring that the inventory is always up-to-date.

## Technologies Used

- **Next.js:** The React framework for production used to create the server-rendered application.
- **Material-UI (MUI):** A popular React UI framework used for styling and layout.
- **Firebase Firestore:** A NoSQL database from Firebase used for real-time data storing and retrieval.

## Setup

To get this project running locally, follow these steps:

1. **Clone the repository:**

git clone https://github.com/your-github/inventory-manager.git
cd inventory-manager

2. Install dependencies:

npm install

3. Run the development server:

npm run dev

Access the application at [http://localhost:3000](http://localhost:3000).

## Deployment

The project is deployed at [Simple Inventory Manager](https://inventory-manager-sigma.vercel.app).

## License
MIT