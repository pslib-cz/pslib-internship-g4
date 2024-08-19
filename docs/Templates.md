# Šablony pro tisk dohody o praxi

Kvůli občasným změnám vzhledu přihlášky probíhá tisk přihlášky tak, že jsou data o praxi, studentovi a podobně dosazena do šablony. Šablona je v zásadě jediný soubor ve formátu .html obsahující zároveň i definici stylů. V dokumentu se nacházejí značky ve formátu {{x.y}} které jsou nahrazeny za příslušné hodnoty.

Náhrada probíhá v [src/app/api/internships/[id]/agreement/route.ts].

## Proměnné šablony

### Student

| Proměnná                 | Význam                    | Příklad                    |
| ------------------------ | ------------------------- | -------------------------- |
| {{Student.GivenName}}    | Jméno studenta            | Alfons                     |
| {{Student.Surname}}      | Příjmení studenta         | Vostrý                     |
| {{Student.Name}}         | Celé jméno studenta       | Alfons Vostrý              |
| {{Student.Email}}        | Email studenta            | alfons.vostry@skola.test   |
| {{Student.Classname}}    | Třída                     | 1.A                        |
| {{Student.BirthDate}}    | Datum narození            | 1.2.2004                   |
| {{Student.Municipality}} | Obec bydliště             | Liberec                    |
| {{Student.Street}}       | Ulice bydliště            | Žirafí                     |
| {{Student.DescNumber}}   | Číslo popisné bydliště    | 10                         |
| {{Student.OrientNumber}} | Číslo orientační bydliště | 3                          |
| {{Student.Zip}}          | PSČ bydliště              | 46001                      |
| {{Student.Address}}      | Celá adresa bydliště      | Žirafí 10/3, Liberec 46010 |
