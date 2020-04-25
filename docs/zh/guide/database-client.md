# Database Client


The **model** class inteface is designed to be abled to be shared by GraphQL request(request from your GraphQL client) and other bussiness logic(request from your server code). You can also use the **model** class as your **database client**. 

Here is an example:

<<< @/example/models/company.js{22-35}

::: tip
Difference between GraphQL client request and server code usage regarding selected fields:
* select: this is an array that contains all the non-nested fields.
* include: this is an object that contains all the nested fields
:::

