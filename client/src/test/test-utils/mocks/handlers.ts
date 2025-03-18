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
];
