# Limitations

* bulk update is doing update one by one in database.
* returning fields in mutations does not work for redshift database.
* not support subscriptions now.
* groupBy and nested fields does not work together for now
* each model can only exist once in the whole nested field/model tree
* nested model will be compiled to one single join, nested join is not supported
* a lot others..
