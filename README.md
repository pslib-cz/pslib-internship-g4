# Správa praxí pro _pslib.cz_

Aplikace slouží pro správu praxí pro potřebu SPŠ a VOŠ Liberec. Má umožňovat:

- studentům
  - vytvářet a registrovat praxe
  - tisknout přihlášku k praxi
  - vytvářet deník praxe
- učitelům
  - vybírat a registrovat praxe ke kontrole
  - vyplňovat zprávu o kontrole
- třídním učitelům
  - kontrolovat, kteří studenti už mají přihlášku
- administrátorům
  - spravovat všechny datové entity
  - vytvářet a spravovat sady praxí
  - vytvářet a spravovat šablony pro přihlášky
  - prohlížet a editovat veškerá data v aplikaci

Aplikace poběží na adrese https://praxe.pslib.cz

## Příkazy ve vývojovém prostředí

Instalace balíčků

```bash
npm install
```

Migrace databáze

```bash
npx prisma migrate dev
```

Spuštění aplikace

```bash
npm run dev
```

Inicializace Prisma

```bash
npx prisma init
```

Vytvoření migrace

```bash
npx prisma migrate dev --name ini
```

Seed databáze

```bash
npx prisma db seed
```

Prettier

```bash
npx prettier . --write
```