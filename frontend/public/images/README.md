# Public Images Folder

Ovaj folder je namijenjen za statičke slike koje se direktno referenciraju iz HTML-a ili CSS-a.

## Kako koristiti slike iz ovog foldera:

### 1. Direktno u HTML/JSX:
```tsx
<img src="/images/my-image.png" alt="Opis slike" />
```

### 2. U CSS fajlovima:
```css
.myComponent {
  background-image: url('/images/my-image.png');
}
```

### 3. U inline stilovima:
```tsx
<div style={{ backgroundImage: 'url(/images/my-image.png)' }}>
```

## Prednosti public foldera:
- Slike su dostupne na fiksnoj putanji
- Mogu se koristiti i van React aplikacije
- Bolje za SEO (search engine optimization)
- Lakše za caching

## Preporučeni formati:
- **PNG** - za slike sa transparentnošću
- **JPG/JPEG** - za fotografije
- **SVG** - za ikonice i vektorske slike
- **WebP** - za bolju kompresiju
- **ICO** - za favicon

## Organizacija:
- `icons/` - za ikonice
- `backgrounds/` - za pozadinske slike
- `logos/` - za logotipe
- `ui/` - za UI elemente 