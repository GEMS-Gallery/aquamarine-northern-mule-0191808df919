import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Grid, Card, CardContent, Button, TextField, CircularProgress } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { backend } from 'declarations/backend';

type Post = {
  id: bigint;
  title: string;
  body: string;
  author: string;
  timestamp: bigint;
};

type PostFormData = {
  title: string;
  body: string;
  author: string;
};

const App: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { control, handleSubmit, reset } = useForm<PostFormData>();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const fetchedPosts = await backend.getPosts();
      setPosts(fetchedPosts);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setLoading(false);
    }
  };

  const onSubmit = async (data: PostFormData) => {
    setLoading(true);
    try {
      const result = await backend.addPost(data.title, data.body, data.author);
      if ('ok' in result) {
        await fetchPosts();
        reset();
      } else {
        console.error('Error adding post:', result.err);
      }
    } catch (error) {
      console.error('Error adding post:', error);
    }
    setLoading(false);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Crypto Blog
        </Typography>
        <Box
          sx={{
            height: '200px',
            backgroundImage: 'url(https://loremflickr.com/g/1200/200/cryptocurrency?lock=1)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            mb: 4,
          }}
        />
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Typography variant="h4" gutterBottom>
              Latest Posts
            </Typography>
            {loading ? (
              <CircularProgress />
            ) : (
              posts.map((post) => (
                <Card key={Number(post.id)} sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant="h5">{post.title}</Typography>
                    <Typography variant="subtitle2" color="text.secondary">
                      By {post.author} on {new Date(Number(post.timestamp) / 1000000).toLocaleString()}
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 2 }}>
                      {post.body}
                    </Typography>
                  </CardContent>
                </Card>
              ))
            )}
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h4" gutterBottom>
              Add New Post
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Controller
                name="title"
                control={control}
                defaultValue=""
                rules={{ required: 'Title is required' }}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    label="Title"
                    fullWidth
                    margin="normal"
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
              <Controller
                name="body"
                control={control}
                defaultValue=""
                rules={{ required: 'Body is required' }}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    label="Body"
                    fullWidth
                    multiline
                    rows={4}
                    margin="normal"
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
              <Controller
                name="author"
                control={control}
                defaultValue=""
                rules={{ required: 'Author is required' }}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    label="Author"
                    fullWidth
                    margin="normal"
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
              <Button type="submit" variant="contained" color="primary" disabled={loading}>
                {loading ? <CircularProgress size={24} /> : 'Submit'}
              </Button>
            </form>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default App;
