# Color System Documentation

**Project:** `frontend_oxjs/`  
**Source:** `frontend_oxjs/index.css`

## CSS Color Variables

All colors in the application are now defined as CSS custom properties (variables) in `index.css`. This makes it easy to maintain consistent color usage and update the theme globally.

### Variable Definitions

Located in `:root` selector at the top of `index.css`:

```css
:root {
  /* Brand Colors */
  --primary-blue: rgb(32, 64, 128);
  --warm-paper: rgb(247, 240, 227);
  --warm-paper-light: #fff4e1;

  /* Neutrals - Grays */
  --white: rgb(255, 255, 255);
  --almost-white: rgb(250, 250, 250);
  --light-gray-bg: rgb(245, 245, 245);
  --light-gray-2: rgb(240, 240, 240);
  --light-gray-3: rgb(224, 224, 224);
  --border-gray: rgb(220, 220, 220);
  --medium-gray: rgb(200, 200, 200);
  --gray-text: rgb(180, 180, 180);
  --gray-1: rgb(160, 160, 160);
  --gray-2: rgb(144, 144, 144);
  --gray-3: rgb(120, 120, 120);
  --gray-4: rgb(96, 96, 96);
  --gray-5: rgb(128, 128, 128);
  --medium-dark-gray: rgb(150, 150, 150);
  --dark-gray: rgb(32, 32, 32);
  --black: rgb(0, 0, 0);
  --almost-black: rgb(16, 16, 16);

  /* Text Colors */
  --text-dark: rgb(0, 10, 83);
  --text-regular: rgb(64, 64, 64);
  --text-light: rgb(180, 180, 180);

  /* Accent Colors */
  --cyan: rgb(140, 255, 205);
  --cyan-dark: rgba(140, 255, 205, 0.8);
  --cyan-light: rgba(140, 255, 205, 0.35);
  --cyan-very-light: rgba(140, 255, 205, 0.15);
  --yellow: rgb(255, 255, 0);

  /* Interactive Colors */
  --blue-highlight: rgb(220, 235, 250);
  --dark-overlay: rgba(0, 0, 0, 0.9);
}
```

## Usage

Replace hardcoded colors in CSS with variables:

### Before

```css
.header {
  background: rgb(247, 240, 227);
  color: rgb(64, 64, 64);
}
```

### After

```css
.header {
  background: var(--warm-paper);
  color: var(--text-regular);
}
```

## Color Palette Reference

### Brand Identity

| Variable             | Value              | Usage                   |
| -------------------- | ------------------ | ----------------------- |
| `--primary-blue`     | rgb(32, 64, 128)   | Headers, buttons, links |
| `--warm-paper`       | rgb(247, 240, 227) | Background panels       |
| `--warm-paper-light` | #fff4e1            | Light accents           |

### Text Colors

| Variable         | Value              | Usage                      |
| ---------------- | ------------------ | -------------------------- |
| `--text-dark`    | rgb(0, 10, 83)     | Dark text, headings        |
| `--text-regular` | rgb(64, 64, 64)    | Regular paragraph text     |
| `--text-light`   | rgb(180, 180, 180) | Placeholder, disabled text |

### Neutral Grays (Light to Dark)

| Variable                 | Value              | Usage                  |
| ------------------------ | ------------------ | ---------------------- |
| `--white`                | rgb(255, 255, 255) | Primary background     |
| `--almost-white`         | rgb(250, 250, 250) | Panel backgrounds      |
| `--light-gray-bg`        | rgb(245, 245, 245) | Hover states           |
| `--light-gray-2`         | rgb(240, 240, 240) | Clip lists, containers |
| `--light-gray-3`         | rgb(224, 224, 224) | Theme background       |
| `--border-gray`          | rgb(220, 220, 220) | Borders, dividers      |
| `--medium-gray`          | rgb(200, 200, 200) | Input borders          |
| `--gray-text`            | rgb(180, 180, 180) | Placeholder text       |
| `--gray-1` to `--gray-5` | Various            | Theme variants         |
| `--dark-gray`            | rgb(32, 32, 32)    | Dark theme text        |
| `--black`                | rgb(0, 0, 0)       | Dark backgrounds, text |
| `--almost-black`         | rgb(16, 16, 16)    | Dark theme background  |

### Accent Colors

| Variable            | Value                     | Usage                   |
| ------------------- | ------------------------- | ----------------------- |
| `--cyan`            | rgb(140, 255, 205)        | Highlights, accents     |
| `--cyan-dark`       | rgba(140, 255, 205, 0.8)  | Doclinks, active states |
| `--cyan-light`      | rgba(140, 255, 205, 0.35) | Subtle backgrounds      |
| `--cyan-very-light` | rgba(140, 255, 205, 0.15) | Very subtle backgrounds |
| `--yellow`          | rgb(255, 255, 0)          | Subtitles, warnings     |

### Interactive States

| Variable           | Value              | Usage                 |
| ------------------ | ------------------ | --------------------- |
| `--blue-highlight` | rgb(220, 235, 250) | Selected items        |
| `--dark-overlay`   | rgba(0, 0, 0, 0.9) | Video overlay, modals |

## Theme Support

The color system supports multiple themes:

### Light Theme

- Background: `--light-gray-3`
- Page: `--white`
- Borders: `--gray-1`

### Medium Theme

- Background: `--gray-2`
- Page: `--gray-1`
- Borders: `--gray-5`

### Dark Theme

- Background: `--almost-black`
- Page: `--black`
- Accents: `--cyan`
- Borders: `--gray-4`

## Benefits

1. **Consistency**: All colors defined in one place
2. **Maintainability**: Update theme by changing variable values
3. **Readability**: Semantic variable names describe color purpose
4. **Flexibility**: Easy to create new themes or color schemes
5. **Scalability**: Supports design system growth

## Future Enhancements

Consider adding:

- CSS variable overrides for dark/light mode
- Animation color variables
- Semantic color aliases (primary, secondary, success, error, etc.)
- Color opacity scale variables
