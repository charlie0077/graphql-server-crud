# Database Client


The **model** class interface is designed to be able to be shared by GraphQL requests (request from your GraphQL client) and other business logic (request from your server code). You can also use the **model** class as your **database client**. 

Here is an example:

<<< @/example/models/company.js{22-35}

::: tip
Difference between GraphQL client request and server code usage regarding selected fields:
* select: this is an array that contains all the non-nested fields.
* include: this is an object that contains all the nested fields
:::

