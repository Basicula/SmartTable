# Searching

For search data in column you can enter some value into edit field and select searching mode. There are several searching modes provided:
- [Exact search](#exact-search)
- [Like search](#like-search)
- [Regular expression](#regular-expression)

# Exact search
This is pretty intuitive and simple searching mode that check that entered value exactly matches value from table. Use **EXACTLY** key word for this searching mode. Example:

| Init column   | Column after searching "1" with EXACTLY |
|:-------------:|:---------------------------------------:|
| 1             | 1                                       |
| 1             | 1                                       |
| 2             |         
| 2             |
| 13            |
| 14            |

# Like search
Use **LIKE** key word to use this type of searching. For each data type it works differently. For numbers it checks prefix of entered value i.e.:

| Init column   | Column after searching "1" with LIKE |
|:-------------:|:------------------------------------:|
| 1             | 1                                    |
| 1             | 1                                    |
| 2             | 13                                   |
| 2             | 14                                   |
| 13            |
| 14            |

For strings it also use prefix comparison and additionally applies algorithm based on [Levenshtein distance](https://en.wikipedia.org/wiki/Levenshtein_distance#:~:text=Informally%2C%20the%20Levenshtein%20distance%20between,considered%20this%20distance%20in%201965.) i.e.:

| Init column   | Column after searching "a" with LIKE |
|:-------------:|:------------------------------------:|
| a             | a                                    |
| a             | a                                    |
| b             | ac                                   |
| b             | ad                                   |
| ac            | ba                                   |
| ad            |
| ba            |

# Regular expression
Use **REGEXP** key word to use this type of searching. This searching mode applies entered pattern to column data it based on Javascript regular expession without modifiers. Examples:
Expression "^A" - searching value have to start with A, i.e. 'A' in "A other" - true, 'A' in "an A" - false.
| Init column   | Column after searching "^Hello" with REGEXP |
|:-------------:|:------------------------------------------:|
| Hello world   | Hello world                                |
| Hello user    | Hello user                                 |
| Hello         | Hello                                      |
| Bye Hello     |                                            |
| Bye world     |                                            |
| Bye user      |                                            |
| Salut         |                                            |

Expression "A$" - searching value have to finish with A, i.e. 'A' in "A other" - false, 'A' in "an A" - true.

| Init column   | Column after searching "world$" with REGEXP |
|:-------------:|:------------------------------------------:|
| Hello world   | Hello world                                |
| Hello user    | Bye world                                  |
| Hello         |                                            |
| Bye Hello     |                                            |
| Bye world     |                                            |
| Bye user      |                                            |
| Salut         |                                            |