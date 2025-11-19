# Rayyan Portfolio

A modern, immersive personal portfolio website inspired by Lando Norris's official website, designed for vertical mobile-first browsing with smooth animations and premium UX.

## Features

- **Vertical-drive hero section** with portrait-optimized layout
- **Scroll lock/unlock** functionality for immersive mobile experience
- **SVG signature animation** with stroke-dasharray drawing effect
- **Responsive image gallery** with fullscreen lightbox viewer
- **Swipe and keyboard navigation** support in lightbox
- **Smooth scroll animations** and intersection observers
- **Accessibility features**: ARIA labels, keyboard navigation, reduced motion support
- **100% vanilla JavaScript** - no frameworks or dependencies
- **Mobile-first responsive design**

## Project Structure

```text
.
├── index.html          # Main HTML file
├── styles.css          # All styles with CSS custom properties
├── script.js           # Vanilla JavaScript for interactions
├── assets/
│   ├── signature.svg   # Animated signature
│   ├── hero.jpg        # Hero section background
│   ├── work-1.jpg      # Work project images
│   ├── work-2.jpg
│   ├── work-3.jpg
│   ├── work-4.jpg
│   └── gallery-*.jpg   # Gallery images (8 total)
└── README.md           # This file
```

## Deployment to GitHub Pages

### Option 1: Quick Deploy (Recommended)

1. Create a new repository named `[your-username].github.io`
2. Clone this repository or upload all files
3. Commit and push to the `main` branch
4. Your site will be live at `https://[your-username].github.io`

### Option 2: Using GitHub Actions

1. Go to your repository settings
2. Navigate to **Pages** section
3. Under **Source**, select `main` branch
4. Click **Save**
5. Wait 1-2 minutes for deployment

### Option 3: Deploy to Custom Domain

1. Add a `CNAME` file to the root directory containing your domain
2. Configure DNS records at your domain provider:

   ```text
   Type: A
   Name: @
   Value: 185.199.108.153
   Value: 185.199.109.153
   Value: 185.199.110.153
   Value: 185.199.111.153
   ```

3. Add CNAME record:

   ```text
   Type: CNAME
   Name: www
   Value: [your-username].github.io
   ```

## Customization

### Colors

Edit CSS custom properties in `styles.css`:

```css
:root {
    --color-bg: #000000;        /* Background */
    --color-text: #ffffff;      /* Text */
    --color-accent: #bfff00;    /* Neon lime accent */
    --color-gray: #666666;      /* Secondary text */
}
```

### Content

- **Personal info**: Edit the hero section in `index.html`
- **Work projects**: Update the `.ln-work-card` sections
- **Gallery images**: Replace images in `/assets` folder
- **Social links**: Update links in header and footer

### Images

Replace placeholder SVGs in `/assets` with your own images:

- `hero.jpg` - 1200x1600px (portrait) recommended
- `work-*.jpg` - 800x600px recommended
- `gallery-*.jpg` - 600x600px (square) recommended

Use tools like [TinyPNG](https://tinypng.com/) to optimize images before uploading.

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- Lazy loading for images
- GPU-accelerated animations (transform, opacity only)
- Intersection Observer for scroll animations
- Minimal JavaScript (~3KB)
- No external dependencies

## Accessibility

- Full keyboard navigation support
- ARIA labels and roles
- Focus management in modal
- `prefers-reduced-motion` support
- Semantic HTML structure

## Local Development

No build process required. Simply open `index.html` in a browser:

```bash
# Using Python 3
python -m http.server 8000

# Using Node.js
npx serve

# Using PHP
php -S localhost:8000
```

Then visit `http://localhost:8000`

## License

Free to use for personal projects. Replace all content with your own.

## Credits

Design inspiration: [Lando Norris Official Website](https://landonorris.com)  
Built by: Rayyan  
Contact: <mmohammedrayyan0808@gmail.com>

---

**Ready to deploy?** Just push to GitHub and you're live! 🚀
