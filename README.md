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

Spuštění aplikace

```bash
npm run dev
```

Korektní typovost

```bash
npm run typecheck
```

Build aplikace

```bash
npm run build
```

## Databáze

Inicializace Prisma

```bash
npx prisma init
```

Vytvoření migrace

```bash
npx prisma migrate dev --name ini
```

Migrace databáze

```bash
npx prisma migrate dev
```

Seed databáze

```bash
npx prisma db seed
```

## Utility

Prettier

```bash
npx prettier . --write
```
