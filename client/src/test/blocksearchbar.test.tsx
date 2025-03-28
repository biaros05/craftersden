import { describe, it, expect, vi } from 'vitest'
import '@testing-library/jest-dom';
import { render, screen, userEvent } from './test-utils';

import BlockSearchBar from '../components/mainUI/BlockSearchBar';
import React from 'react';

import { CurrentBlockContext } from '../context/currentBlockContext';

const blockListMock = [
  {
    name: 'grass_block'
  },
  {
    name: 'test_block'
  }
]

describe('BlockSearchBar tests', ()=> {

  it('renders search bar', () => {
    render(<BlockSearchBar blockList={blockListMock} searchValue='' setSearchValue={() => {}}/>);
    const search = screen.getByRole('textbox');

    expect(search).toBeInTheDocument();
  });

  it.skip('block is stored in context when searched', async () => {
    const storeBlockMock = vi.fn();
    render(
      <CurrentBlockContext.Provider value={{storeBlock: storeBlockMock}}>
        <BlockSearchBar blockList={blockListMock} searchValue='' setSearchValue={() => {}}/>
      </CurrentBlockContext.Provider>
    );
    const user = userEvent.setup();
    const search = screen.getByRole('textbox');

    await user.type(search, 'grass_block');
    await user.click(screen.getByText('grass_block'));

    expect(storeBlockMock).toHaveBeenCalled();
  });

  it.skip('search history is updated when searched', async () => {
    render(
      <CurrentBlockContext.Provider value={{storeBlock: () => {}}}>
        <BlockSearchBar blockList={blockListMock} searchValue='' setSearchValue={() => {}}/>
      </CurrentBlockContext.Provider>
    );

    const user = userEvent.setup();
    const search = screen.getByRole('textbox');

    await user.type(search, 'grass_block');
    await user.click(screen.getByText('grass_block'));

    await user.click(search);

    expect(screen.getByText('grass_block')).toBeInTheDocument();
  });
  
});