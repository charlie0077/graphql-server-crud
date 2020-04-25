# Limitations

* bulk update is doing update one by one in database.
* returning fields in mutations does not work for redshift database.
* not support subscriptions now.
* each model can only exist once in the whole nested field/model tree
* for sorting in nested fields, you need to include the sort field in the selected list, because we are doing a memory sort.
* type interface is not generated yet
* a lot others..
