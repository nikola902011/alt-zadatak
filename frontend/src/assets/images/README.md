# Images Folder

Ovaj folder je namijenjen za čuvanje slika koje se koriste u React komponentama.

## Kako koristiti slike iz ovog foldera:

### 1. Import slike u komponentu:
```tsx
import myImage from '../assets/images/my-image.png';
```

### 2. Koristiti sliku u JSX:
```tsx
<img src={myImage} alt="Opis slike" />
```

### 3. Koristiti kao background u CSS:
```css
.myComponent {
  background-image: url('../assets/images/my-image.png');
}
```

## Preporučeni formati:
- **PNG** - za slike sa transparentnošću
- **JPG/JPEG** - za fotografije
- **SVG** - za ikonice i vektorske slike
- **WebP** - za bolju kompresiju (sa fallback-om)

## Organizacija:
- `icons/` - za ikonice
- `backgrounds/` - za pozadinske slike
- `logos/` - za logotipe
- `ui/` - za UI elemente 