# Správa praxí pro _pslib.cz_

Aplikace slouží pro správu praxí pro potřebu SPŠ a VOŠ Liberec. Umožňuje:

- studentům
  - [x] vytvářet a registrovat praxe
  - [ ] upravovat a mazat vytvořené praxe
  - [ ] tisknout přihlášku k praxi
  - [ ] vytvářet deník praxe
- učitelům
  - [ ] vybírat a registrovat praxe ke kontrole
  - [ ] vyplňovat zprávu o kontrole
- třídním učitelům
  - [ ] kontrolovat, kteří studenti už mají přihlášku
- administrátorům
  - [x] vytvářet a spravovat sady praxí
  - [x] vytvářet a spravovat šablony pro přihlášky
  - [x] spravovat uživatele
  - [x] spravovat firmy
  - [x] spravovat značky pro firmy
  - [ ] prohlížet a editovat veškerá data v aplikaci

Aplikace běží na adrese https://praxe.pslib.cz

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

Vygenerování klienta

```bash
npx prisma generate
```

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
