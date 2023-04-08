# PharmaPay

PharmaPay is a checkout system similar to what you would find in pharmacies, complete with a frontend interface for managing inventory items and a way to sell said inventory items.

### Key URLs

1. Live site: https://pharma-pay-ui.vercel.app
2. Backend API (Spring Boot): https://github.com/AndyCodez/pharma-pay

## Overview

PharmaPay consists of two separate applications: a backend built in Spring Boot and a frontend built in React JS. The backend provides a set of REST APIs to manage the inventory items, bills, and users. The frontend provides an intuitive and easy-to-use interface for managing the inventory items, selling them to customers, and tracking the sales history.

The system is designed with three types of users in mind: pharmacists, customers with an account, and customers without an account. The customers are indirect users of the account i.e only pharmacists interact directly with the system.

## Key Features

### Inventory Management

The system allows pharmacists to create, update, and delete inventory items. The inventory items can be searched through for quick finding.

### Sales Management

The system allows pharmacists to sell inventory items to customers. A bill can optionally be assigned to a customer. Think of this as the ability to have over the counter transactions. The system provides an intuitive and easy-to-use interface for selling items, and generating bills.

### User Management

The system allows admin pharmacists to create and manage user accounts, with different permissions and roles.

### Security and Authentication

The system is designed with security in mind, using modern authentication and authorization techniques. The system uses Spring Security + JWT to handle authentication and authorization. There are different levels of access for different user types.

The pharamacists have different set of permissions and actions they can perform. The roles are ADMIN, and NORMAL_PHARMACIST.

### Normal Pharmacists' permissions

Manage sales. Includes creating and validating bills.

### Admin permissions

Manage sales. Includes creating and validating bills.
Only admins can create, update, and delete inventory.
Only admins can register other pharmacists.
Only admins can register customers.
Only admins can view sales data.

### Test Suites and Audit Trail

The system has been built with a comprehensive set of test suites, including unit tests, and integration tests. The system also provides an audit trail that tracks all changes to the database, enhancing monitoring of the system's usage and preventing unauthorized access.

## Acceptance Testing

The system is intentionally built to restrict registration and new pharmacist accounts can only be created by admin users.

To sign in as the admin user:

```
email: johndoe@example.com
password: password123
```

To sign in as a normal user:

```
email: brondoe@example.com
password: password123
```

## Installation

### Backend

1. Clone the backend repository using the following command:

`git clone https://github.com/AndyCodez/pharma-pay`

2. Setup the environment variables in the application.properties files

3. Install the required dependencies:

`mvn clean install`

4. Start the server by running:

`mvn spring-boot:run`

### Frontend

1. Clone this repository:

`git clone https://github.com/AndyCodez/pharma-pay-ui`

2. Rename .env.local.example to .env.local and edit the url to match the port number of the Spring Boot application.

3. Install the required packages by running:

`npm install`

4. Start the server by running:

`npm start`

## Testing

The backend is extensively tested:

You can run the tests with `mvn test`
