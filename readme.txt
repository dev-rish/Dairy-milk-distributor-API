MongoDB is used with two collections to store data:
- Capacity (Refer Schema in Swagger)
    - This is responsible for keeping track of details like max capacity, quantity of milk left, price of milk (per litre), etc for a given date.
    - Some fields can be updated while other are not allowed to be updated.
    - Capacity details of only current & future dates can be updated.

- Order (Refer Schema in Swagger)
    - Keeps track of all the orders that have been placed for today.
    - Orders cannot be placed for past or future dates
    - Delivery date is set once the order status is updated to DELIVERED.
    - Order cannot be updated or deleted if delivered
    - If an undelivered order is deleted, the capacity details (quantity left) is reverted.

Other Info.
- Max Capacity, Unit Price for a date is initialized via environment variables which is currently set to 1000, 70 respectively.
- Quantity left is initialized with Max Capacity value.
- Precision is set upto 2 decimal places for all numerical values.
- API is live on URL https://milk-distributor.herokuapp.com/
- Swagger has been used for API documentation and as palyground for trying out APIs.
  Visit https://milk-distributor.herokuapp.com/api-docs/ for more.
