# requirements.md — Required Assets

This document lists all the external assets, such as fonts and images, required for the development and production of the Wayfarer platform.

## 1. Fonts

The design specifies three font families. These should be sourced from a provider like Google Fonts to ensure they are correctly licensed and performant.

| Role | Typeface | Source (Example) | Weights |
|---|---|---|---|
| **Display** | Fraunces | Google Fonts | Variable, 400-700 recommended for standard cuts |
| **Body/UI** | General Sans | Fontshare | 400 (Regular), 500 (Medium), 600 (Semibold) |
| **Data/Labels** | IBM Plex Mono | Google Fonts | 400 (Regular), 500 (Medium) |

### Implementation Notes:
-   The fonts should be included in the `client/index.html` file via `<link>` tags from the font provider.
-   Font weights should be configured in `tailwind.config.js` to be accessible via utility classes.

## 2. Images

All images in the application are intended to be user-generated content uploaded by Admins or Vendors. For development, testing, and placeholder states, we need a set of placeholder images.

### Placeholder Image Requirements:
-   **Aspect Ratios:**
    -   Destination/Package Hero Images: **16:9** or **3:2** (landscape)
    -   Card Thumbnails (Destinations, Packages, Hotels): **4:3**
    -   User Avatars: **1:1** (square)
-   **Content:**
    -   The images should be high-quality and travel-related (landscapes, cityscapes, hotel interiors, etc.).
    -   They should be generic enough to not imply a specific real-world location that could conflict with mock data.
    -   Using a service like Unsplash, Pexels, or a placeholder generation tool (e.g., `https://picsum.photos`) is recommended. Ensure the license for any sourced photos allows for this kind of use.
-   **Alt Text:**
    -   All images, including placeholders, **must** have descriptive `alt` text for accessibility. For placeholders, the alt text should clearly state what the image represents (e.g., "Placeholder for a tropical beach destination").

### Asset List for Initial Development:

-   **Destination Placeholders:** ~5-10 high-resolution landscape images.
-   **Tour Package Placeholders:** ~10-15 images that can represent different types of activities (e.g., hiking, city tours, cultural experiences).
-   **Hotel Placeholders:** ~5-10 images of hotel exteriors and room interiors.
-   **User Avatar Placeholders:** 1-3 generic default avatar images (e.g., a simple silhouette or initials).

## 3. Icons

While most UI elements are component-based, a few simple icons will be necessary. These should be sourced from a reputable, tree-shakeable library like **Lucide React** or **Heroicons** to keep bundle size down.

### Required Icons:
-   Navigation (Menu, Close, Back)
-   Search
-   Filters
-   Star (for ratings)
-   Chevron (Up, Down, Left, Right for carousels, accordions, etc.)
-   Plus / Minus (for quantity selectors)
-   Checkmark (for success states)
-   Alert/Warning
-   User profile
-   Logout
-   Date/Calendar

These icons should be integrated as React components for easy styling with Tailwind CSS.
