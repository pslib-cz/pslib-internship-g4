# Šablony pro tisk dohody o praxi

Kvůli občasným změnám vzhledu přihlášky probíhá tisk přihlášky tak, že jsou data o praxi, studentovi a podobně dosazena do šablony. Šablona je v zásadě jediný soubor ve formátu `.html` obsahující zároveň i definici stylů. V dokumentu se nacházejí značky ve formátu `{{x.y}}`, které jsou nahrazeny za příslušné hodnoty.

Náhrada probíhá v `[src/app/api/internships/[id]/agreement/route.ts]`.

## Proměnné šablony

### Student

| Proměnná                 | Význam                    | Příklad                    |
| ------------------------ | ------------------------- | -------------------------- |
| `{{Student.GivenName}}`  | Jméno studenta            | Alfons                     |
| `{{Student.Surname}}`    | Příjmení studenta         | Vostrý                     |
| `{{Student.Name}}`       | Celé jméno studenta       | Alfons Vostrý              |
| `{{Student.Email}}`      | Email studenta            | alfons.vostry@skola.test   |
| `{{Student.Classname}}`  | Třída                     | 1.A                        |
| `{{Student.BirthDate}}`  | Datum narození            | 1.2.2004                   |
| `{{Student.Municipality}}` | Obec bydliště             | Liberec                    |
| `{{Student.Street}}`     | Ulice bydliště            | Žirafí                     |
| `{{Student.DescNumber}}` | Číslo popisné bydliště    | 10                         |
| `{{Student.OrientNumber}}` | Číslo orientační bydliště | 3                          |
| `{{Student.Zip}}`        | PSČ bydliště              | 46001                      |
| `{{Student.Address}}`    | Celá adresa bydliště      | Žirafí 10/3, Liberec 46010 |

### Sada praxí

| Proměnná                     | Význam                                     | Příklad                   |
| ---------------------------- | ------------------------------------------ | ------------------------- |
| `{{Set.Start}}`              | Datum začátku praxe                        | 1.9.2024                  |
| `{{Set.End}}`                | Datum konce praxe                          | 30.9.2024                 |
| `{{Set.DaysTotal}}`          | Celkový počet dnů praxe                    | 10                        |
| `{{Set.HoursDaily}}`         | Počet hodin denně                          | 8                         |
| `{{Set.Continuous}}`         | Typ praxe (průběžná/souvislá)              | souvislá                  |
| `{{Set.Year}}`               | Školní rok                                 | 2024                      |
| `{{School.RepresentativeName}}` | Jméno zástupce školy                     | Karel Dvořák              |
| `{{School.RepresentativeEmail}}`| Email zástupce školy                     | dvorak.karel@skola.cz     |
| `{{School.RepresentativePhone}}`| Telefon zástupce školy                   | +420123456789             |
| `{{School.Name}}`            | Název školy                                | Střední průmyslová škola  |
| `{{School.Logo}}`            | Název souboru s logem školy                | logo.png                  |

### Firma

| Proměnná                     | Význam                                    | Příklad                   |
| ---------------------------- | ----------------------------------------- | ------------------------- |
| `{{Company.Name}}`           | Název společnosti                        | ABC, s.r.o.               |
| `{{Company.CompanyIdentificationNumber}}` | IČ společnosti                   | 12345678                  |
| `{{Company.RepresentativeName}}` | Jméno zástupce společnosti             | Jan Novák                 |
| `{{Company.RepresentativeEmail}}`| Email zástupce společnosti             | jan.novak@abc.cz          |
| `{{Company.RepresentativePhone}}`| Telefon zástupce společnosti           | +420987654321             |
| `{{Company.MentorName}}`     | Jméno mentora                            | Petr Svoboda              |
| `{{Company.MentorEmail}}`    | Email mentora                            | petr.svoboda@abc.cz       |
| `{{Company.MentorPhone}}`    | Telefon mentora                          | +420789456123             |
| `{{Company.Municipality}}`   | Obec sídla společnosti                   | Praha                     |
| `{{Company.Street}}`         | Ulice sídla společnosti                  | Příkop                    |
| `{{Company.DescNumber}}`     | Číslo popisné sídla společnosti           | 15                        |
| `{{Company.OrientNumber}}`   | Číslo orientační sídla společnosti        | 5A                        |
| `{{Company.Zip}}`            | PSČ sídla společnosti                    | 11000                     |
| `{{Company.Address}}`        | Celá adresa sídla společnosti            | Příkop 15/5A, Praha 11000 |

### Praxe

| Proměnná             | Význam                          | Příklad                   |
| -------------------- | ------------------------------- | ------------------------- |
| `{{Internship.Kind}}`| Druh praxe                      | Odborná                   |
| `{{Description}}`    | Popis náplně práce              | Práce s klienty           |
| `{{Info}}`           | Další informace                 | Bez speciálních požadavků |
| `{{Appendix}}`       | Dodatečný text                  | Žádný                     |

### Místo praxe

| Proměnná             | Význam                          | Příklad                   |
| -------------------- | ------------------------------- | ------------------------- |
| `{{Location.Municipality}}` | Obec místa výkonu praxe       | Brno                      |
| `{{Location.Street}}`       | Ulice místa výkonu praxe      | Černá Pole                |
| `{{Location.DescNumber}}`   | Číslo popisné místa praxe     | 24                        |
| `{{Location.OrientNumber}}` | Číslo orientační místa praxe  | 12A                       |
| `{{Location.Zip}}`          | PSČ místa výkonu praxe        | 60200                     |
| `{{Location.Address}}`      | Celá adresa místa praxe       | Černá Pole 24/12A, Brno 60200 |

### Ostatní

| Proměnná        | Význam                          | Příklad                   |
| --------------- | ------------------------------- | ------------------------- |
| `{{Date}}`      | Aktuální datum                  | 10.1.2025                 |

---

Tento dokument slouží k dokumentaci šablon a náhradních proměnných, které se využívají při tisku dohody o praxi.
