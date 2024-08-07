# Správa praxí pro _pslib.cz_

Aplikace slouží pro správu praxí pro potřebu SPŠ a VOŠ Liberec.

Aplikace běží na adrese https://praxe.pslib.cz.

## Instalace

### Lokální prostředí

1. Instalace balíčků navzdory závislostem

```bash
npm install --force
```

2. Vygenerování klienta Prisma

```bash
npx prisma generate
```

3. Migrace databáze (automaticky proběhne i seed dat)

```bash
npx prisma migrate dev
```

4. Konfigurace aplikace v souboru [.env] nebo .env.local vlastními klíči

5. Spuštění aplikace

```bash
npm run dev
```

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

### Databáze

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

### Utility

Prettier

```bash
npx prettier . --write
```