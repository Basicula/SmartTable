# Interface

SmartTable editor provides several main sections:
- [Menu section](#menu-section)
- [Properties section](#properties-section)
- [Tables section](#tables-section)

# Menu section

Menu contains several sections:
- [File](#file)
- [Edit](#edit)
- [Help](#help)

## File

This section provides functionality to work with files. For more details about save and load options check [here](Save_Load.md).

## Edit

This section provides functionality to work with tables and its content. Here you will find several options:
- New table - creates new table with default name **"New table"** that can be changed after creation
- New column - creates new property/column with default settings: name - **"New property"**, type - string, desctiption - empty .All settings can be changed after creation.
- New row - creates new row to the end of your current table with empty cells.

## Help

This section provides helpful information that will give you depper explanation about interactive elements or functionality that you can use.

# Properties section

Each property(column) has:
- name(required) - the name/header of column
- type(required) - type of data that stored inside column
- description(optional) - content that explain column content in more details

If you press on **small triangle** near name of property you will open details of property i.e. description and type, there you can enter new data or change existing within interface. To close details just press again on **triangle**.

If you press RMB(right mouse button) you will see context menu with several options:
- Delete - deletes this property from your table **forever**
- Insert before - inserts new property **before** this property with default settings
- Insert after - inserts new property **after** this property with default settings

If you hover mouse with pressed **Ctrl** key on property you will see description of that property.

# Tables section

This section will help you to see result of your request. At the top of table view you can find tabs that represent all your tables in project together with plus button that creates new table with default settings after pressing. If you click on the tab you will select table with clicked name. 

Each table has a columns with headers that for your request for table. If you open details of column by clicking triangle you will see several options:
- Edit field - field for entering data for searching
- [Searching mode](Searching.md) - mode to understand how to process your entered data in edit field
- [Sorting mode](Sorting.md) - mode for sorting table data