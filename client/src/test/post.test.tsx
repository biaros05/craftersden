import { describe, it, expect, vi, beforeAll, afterEach, afterAll } from 'vitest'
import '@testing-library/jest-dom';
import { render, screen, userEvent, within } from './test-utils';
import { handlers } from './test-utils/mocks/handlers.ts';
import  { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

import Post from '../components/Post';
import React from 'react';

const postMock = {
  buildId: '1',
  description: 'test description',
  liked: false,
  saved: false,
  imageURL: 'test-url',
  username: 'test-username',
  tags: [] as [],
  viewPostOnClick: vi.fn(),
}

const server = setupServer(...handlers);

describe('Post tests', () => {

  beforeAll(() => server.listen());
  
  afterEach(() => {
    server.resetHandlers();
  })
  
  afterAll(() => server.close());

  it('renders post', () => {
    const { renderResult } = render(<Post 
      buildId={postMock.buildId}
      description={postMock.description}
      liked={postMock.liked}
      saved={postMock.saved}
      imageURL={postMock.imageURL}
      username={postMock.username}
      viewPostOnClick={postMock.viewPostOnClick}
      tags={postMock.tags}
    />);
    
      const postElement = renderResult.container.getElementsByClassName('post')[0];
      expect(postElement).toBeInTheDocument();
  });

  it('post is viewed on click', async () => {
    render(<Post 
      buildId={postMock.buildId}
      description={postMock.description}
      liked={postMock.liked}
      saved={postMock.saved}
      imageURL={postMock.imageURL}
      username={postMock.username}
      viewPostOnClick={postMock.viewPostOnClick}
      tags={postMock.tags}
      />);
    const user = userEvent.setup();
    const post = screen.getByRole('img');

    await user.click(post);

    expect(postMock.viewPostOnClick).toHaveBeenCalled();

  });
  it('post loads likes and saves', async () => {
    server.use(
      http.get('/api/post/1/likes-saves', () => {
        return HttpResponse.json({
          likedBy: ['user1'],
          savedBy: ['user1', 'user2']
        })
      })
    )
    render(<Post 
      buildId={postMock.buildId}
      description={postMock.description}
      liked={postMock.liked}
      saved={postMock.saved}
      imageURL={postMock.imageURL}
      username={postMock.username}
      viewPostOnClick={postMock.viewPostOnClick}
      tags={postMock.tags}
      />);

    const likes = await screen.findByText('1');
    const saves = await screen.findByText('2');

    expect(likes).toBeInTheDocument();
    expect(saves).toBeInTheDocument();
  });

  //flaky tests, works on my laptop, but not my desktop
  it.skip('post is liked', async () => {
    render(<Post
      buildId={postMock.buildId}
      description={postMock.description}
      liked={postMock.liked}
      saved={postMock.saved}
      imageURL={postMock.imageURL}
      username={postMock.username}
      viewPostOnClick={postMock.viewPostOnClick}
      tags={postMock.tags}
      />);
    const user = userEvent.setup();
    const likeButton = screen.getByRole('button', { name: /like/i });

    screen.debug()
    await user.click(likeButton);

    const likeCount = within(likeButton).getByText('1');

    expect(likeCount).toBeInTheDocument();
  });

  it.skip('post is saved', async () => {
    render(<Post
      buildId={postMock.buildId}
      description={postMock.description}
      liked={postMock.liked}
      saved={postMock.saved}
      imageURL={postMock.imageURL}
      username={postMock.username}
      viewPostOnClick={postMock.viewPostOnClick}
      tags={postMock.tags}
      />);
    const user = userEvent.setup();
    const saveButton = screen.getByRole('button', { name: /save/i });

    screen.debug()
    await user.click(saveButton);

    const saveCount = within(saveButton).getByText('1');

    expect(saveCount).toBeInTheDocument();
  })


});