import { describe, it, expect, vi } from 'vitest'
import '@testing-library/jest-dom';
import { render, screen, userEvent } from './test-utils';

import BlockImage from '../components/mainUI/BlockImage';
import React from 'react';
import { CurrentBlockContext } from '../context/currentBlockContext';

const blockMock = {
  '_id': '1',
  'name': 'acacia_button',
  'cuboids': [
    {
      'from': [0.3125, 0.375, 0.375],
      'to': [0.6875, 0.625, 0.625],
      'faces': {
        'down': {
          'uv': [5, 6, 11, 10],
          'texture': 'https://imageblobbed.blob.core.windows.net/assets/acacia_planks.png'
        },
        'up': {
          'uv': [5, 10, 11, 6],
          'texture': 'https://imageblobbed.blob.core.windows.net/assets/acacia_planks.png'
        },
        'north': {
          'uv': [5, 12, 11, 16],
          'texture': 'https://imageblobbed.blob.core.windows.net/assets/acacia_planks.png'
        },
        'south': {
          'uv': [5, 12, 11, 16],
          'texture': 'https://imageblobbed.blob.core.windows.net/assets/acacia_planks.png'
        },
        'west': {
          'uv': [6, 12, 10, 16],
          'texture': 'https://imageblobbed.blob.core.windows.net/assets/acacia_planks.png'
        },
        'east': {
          'uv': [6, 12, 10, 16],
          'texture': 'https://imageblobbed.blob.core.windows.net/assets/acacia_planks.png'
        }
      }
    }
  ],
  'inventoryTexture': 'minecraft_acacia_button.png'
};

describe('BlockImage tests', ()=> {

  it('ActionIcon calls storeBlock from context', async () => {
    const user = userEvent.setup();
    const storeBlockMock = vi.fn();

    render(
    <CurrentBlockContext.Provider value={{currentBlock : null, storeBlock: storeBlockMock }}>
      <BlockImage block={blockMock}/>
    </CurrentBlockContext.Provider>
  );

  const button = screen.getByRole('button', {name : 'Add to inventory'});
  await user.click(button);

  expect(storeBlockMock).toHaveBeenCalled();
  expect(storeBlockMock).toHaveBeenCalledWith(blockMock);
  });

  it('image and name rendered', async() => {
    render(<BlockImage block={blockMock} />);
    const image = screen.getByAltText(/acacia_button/i);
    const name = screen.getByText(/acacia_button/i);

    expect(name).toBeInTheDocument();
    expect(image).toBeInTheDocument();
  })

  it('image uses fallback when no inventoryTexture provided', async () => {
    render(<BlockImage block={{...blockMock, inventoryTexture: ''}}/>)

    const image = screen.getByAltText(/acacia_button/i);

    expect(image).toHaveAttribute('src', 'https://placehold.co/600x400?text=Placeholder');
  })
})