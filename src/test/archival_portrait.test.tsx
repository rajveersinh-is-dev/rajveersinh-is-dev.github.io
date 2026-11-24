import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ArchivalPortrait } from '../components/common/ArchivalPortrait';
import { PreferencesProvider } from '../context';

describe('ArchivalPortrait Component', () => {
  it('renders the archival portrait plate with cadastral framing and default engraving mode', () => {
    const { container } = render(
      <PreferencesProvider>
        <ArchivalPortrait />
      </PreferencesProvider>
    );

    // Caption and titles
    expect(screen.getByText(/PLATE I • ARCHIVAL PORTRAIT/i)).toBeTruthy();
    expect(screen.getByText(/R\. V\. Pardeshi/i)).toBeTruthy();

    // Mode buttons
    expect(screen.getByRole('button', { name: /Engraving/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /Photo Plate/i })).toBeTruthy();

    // Cadastral corner brackets
    expect(container.textContent).toContain('┌');
    expect(container.textContent).toContain('┐');
    expect(container.textContent).toContain('└');
    expect(container.textContent).toContain('┘');

    // Canvas exists with proper accessibility label
    const canvas = container.querySelector('canvas');
    expect(canvas).toBeTruthy();
    expect(canvas?.getAttribute('aria-label')).toContain('Rajveersinh Pardeshi');
  });

  it('toggles interactively between Bayer dither engraving and photographic plate', () => {
    const { container } = render(
      <PreferencesProvider>
        <ArchivalPortrait />
      </PreferencesProvider>
    );

    const photoBtn = screen.getByRole('button', { name: /Photo Plate/i });
    fireEvent.click(photoBtn);

    // In photo mode, the image tag is rendered
    const img = container.querySelector('img');
    expect(img).toBeTruthy();
    expect(img?.getAttribute('alt')).toContain('Photograph of Rajveersinh Vishal Pardeshi');

    // Switch back to engraving
    const engravingBtn = screen.getByRole('button', { name: /Engraving/i });
    fireEvent.click(engravingBtn);

    // Image is unmounted from active display
    expect(container.querySelector('img')).toBeNull();
  });

  it('maintains strict offline integrity without remote image URLs', () => {
    const { container } = render(
      <PreferencesProvider>
        <ArchivalPortrait />
      </PreferencesProvider>
    );

    const photoBtn = screen.getByRole('button', { name: /Photo Plate/i });
    fireEvent.click(photoBtn);

    const img = container.querySelector('img');
    const src = img?.getAttribute('src') || '';

    expect(src).not.toMatch(/^https?:\/\//i);
    expect(src).not.toMatch(/^data:image/i);
  });
});
