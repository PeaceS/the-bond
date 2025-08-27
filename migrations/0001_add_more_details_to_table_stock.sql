-- Migration number: 0001 	 2025-08-27T09:59:13.669Z

-- The `id` column is a primary key that auto-increments.
-- The `item` column stores the item name as a string.
-- The `stock` column stores the number of items in stock as an integer.

CREATE TABLE stock (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    item TEXT NOT NULL,
    stock INTEGER NOT NULL,
    description TEXT,
    price INTEGER NOT NULL,
    paypal_id TEXT NOT NULL
);
