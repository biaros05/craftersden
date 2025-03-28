import { http, HttpResponse } from 'msw'

export const handlers = [
  http.get('/api/query', () => {
    return HttpResponse.json({user: '1'});
  }),
  http.get('/api/user/:email/builds', ({ params }) => {
    const { email } = params;
    if (!email) {
      return new HttpResponse('Not Found', { status: 404 });
    }
    return HttpResponse.json(
      {
        builds: [
          {
            'description': 'This is a test build',
            'user': 'userID',
            'buildJSON': {'current': {}},
            'isPublished': false,
            'thumnails': [],
            'progressPicture': 'sampleURL'
          }
        ]
      }
    )
  }),
  http.get('/api/post', () => {
    return HttpResponse.json({
      message: 'Published builds fetched!',
      builds: [
        {
          username: 'test',
          buildJSON: {},
          tags: []
        }
      ],
    })
  }),
  http.get('/api/user/:email/saved-posts', () => {
    return HttpResponse.json(
      {
        message: 'Saved posts retrieved successfully',
        savedBuilds: [
          {
            username: 'test',
            buildJSON: {}
          }
        ]
      }
    )
  }),
  http.get('/api/post/:buildId/likes-saves', () => {
    return HttpResponse.json(
      {
        message: 'Likes and saves retrieved successfully',
        likedBy: [],
        savedBy: []
      }
    )
  }),
  http.post('/api/post/toggle-like', () => {
    return HttpResponse.json(
      {
        message: 'Post liked successfully'
      }
    );
  }),
  http.post('/api/post/toggle-save', () => {
    return HttpResponse.json(
      {
        message: 'Post saved successfully'
      }
    );
  }),
];
