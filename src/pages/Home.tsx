import { useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Button,
} from '@mui/material';
import React from "react";

const Home = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/projects');
  };

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          mt: 8,
          mb: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <Typography variant="h3" component="h1" gutterBottom>
          Welcome to the Project Management App
        </Typography>
        <Typography variant="h6" component="p" gutterBottom>
          Organize your projects efficiently and collaborate with your team seamlessly.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleGetStarted}
          sx={{ mt: 4 }}
        >
          Get Started
        </Button>
      </Box>
    </Container>
  );
};

export default React.memo(Home);